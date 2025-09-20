import time
import logging
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.mail import EmailMultiAlternatives, get_connection
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import threading
from collections import deque

from .forms import FeedbackForm
from reqs.utils import get_active_recipients

log = logging.getLogger(__name__)

def _ip(request):
    return (request.META.get('HTTP_X_REAL_IP')
            or (request.META.get('HTTP_X_FORWARDED_FOR') or '').split(',')[0].strip()
            or request.META.get('REMOTE_ADDR') or '0.0.0.0')



log = logging.getLogger(__name__)

_local_rl = {}
_local_lock = threading.Lock()

def _rate_ok(ip: str) -> bool:

    try:
        return _rate_ok_cache(ip)
    except Exception as e:
        log.warning("RateLimit via cache failed: %s; fallback to local memory", e)
        return _rate_ok_local(ip)

def _rate_ok_cache(ip: str) -> bool:
    s_key = f'fb:{ip}:s'  # short window
    h_key = f'fb:{ip}:h'  # hour window

    s = _safe_incr(s_key, settings.RATE_SHORT)
    h = _safe_incr(h_key, settings.RATE_HOUR)

    return (s <= settings.RATE_SHORT_MAX) and (h <= settings.RATE_HOUR_MAX)

def _safe_incr(key: str, ttl: int) -> int:
    created = cache.add(key, 1, ttl)
    if created:
        return 1
    try:
        cache.incr(key)
    except Exception:
        cache.set(key, 1, ttl)
        return 1
    val = cache.get(key)
    return int(val or 1)

def _rate_ok_local(ip: str) -> bool:
    now = time.time()
    with _local_lock:
        qs = _local_rl.setdefault((ip, 's'), deque())
        qh = _local_rl.setdefault((ip, 'h'), deque())

        sw = settings.RATE_SHORT
        hw = settings.RATE_HOUR
        while qs and (now - qs[0]) > sw:
            qs.popleft()
        while qh and (now - qh[0]) > hw:
            qh.popleft()

        qs.append(now)
        qh.append(now)

        return (len(qs) <= settings.RATE_SHORT_MAX) and (len(qh) <= settings.RATE_HOUR_MAX)


def _send_mail_async(ctx: dict, recipients: list[str]):
    try:
        html = render_to_string('emails/feedback.html', ctx)
        text = strip_tags(html)
        conn = get_connection(
            username=settings.EMAIL_HOST_USER,
            password=settings.EMAIL_HOST_PASSWORD,
            fail_silently=True,
        )
        msg = EmailMultiAlternatives(
            subject=f'Feedback: {ctx["name"]} ({ctx["phone"]})',
            body=text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
            headers={'X-Feedback-IP': ctx.get('ip','')}
        )
        msg.attach_alternative(html, 'text/html')
        conn.send_messages([msg])
        log.info("Feedback mail sent to %s", recipients)
    except Exception as e:
        log.exception("Feedback mail failed: %s", e)

@require_POST
def feedback_submit(request):
    form = FeedbackForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'ok': False, 'errors': form.errors}, status=400)

    started = form.cleaned_data.get('ts') or 0
    dt = int(time.time()) - started if started else 999999
    if dt < settings.FORM_MIN_SECONDS or dt > settings.FORM_MAX_SECONDS:
        return JsonResponse({'ok': False, 'errors': {'__all__': ['Bot detected']}}, status=400)

    ip = _ip(request)
    if not _rate_ok(ip):
        return JsonResponse({'ok': False, 'errors': {'__all__': ['Too many requests']}}, status=429)

    data = form.cleaned_data
    ctx = {
        'ip': ip,
        'name': data['name'],
        'company': data.get('company') or '—',
        'phone': data['phone'],
        'email': data['email'],
        'comment': data.get('comment') or '—',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
    }

    from reqs.utils import get_active_recipients
    recipients = get_active_recipients()

    threading.Thread(target=_send_mail_async, args=(ctx, recipients), daemon=True).start()
    return JsonResponse({'ok': True, 'queued': True})

