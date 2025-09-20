from django.core.cache import cache
from django.conf import settings
from .models import ReqsRecipient
import logging

log = logging.getLogger(__name__)

CACHE_KEY = 'reqs:recipients:v1'
TTL = 60

def get_active_recipients():
    try:
        emails = cache.get(CACHE_KEY)
    except Exception as e:
        log.warning("Cache get failed: %s", e)
        emails = None

    if emails is None:
        emails = list(ReqsRecipient.objects.filter(is_active=True).values_list('email', flat=True))
        if not emails:
            emails = [getattr(settings, 'FEEDBACK_FALLBACK_TO', settings.DEFAULT_FROM_EMAIL)]
        try:
            cache.set(CACHE_KEY, emails, TTL)
        except Exception as e:
            log.warning("Cache set failed: %s", e)
    return emails

def invalidate_recipients_cache():
    try:
        cache.delete(CACHE_KEY)
    except Exception as e:
        log.warning("Cache delete failed: %s", e)
