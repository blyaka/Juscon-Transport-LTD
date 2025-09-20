from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ReqsRecipient
from .utils import invalidate_recipients_cache

@receiver([post_save, post_delete], sender=ReqsRecipient)
def _invalidate_recipients(*args, **kwargs):
    invalidate_recipients_cache()
