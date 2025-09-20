from django.db import models

class ReqsRecipient(models.Model):
    name = models.CharField(max_length=120, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Получатель заявок'
        verbose_name_plural = 'Получатели заявок'

    def __str__(self):
        return f'{self.name or self.email} ({self.email})'
