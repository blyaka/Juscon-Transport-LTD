from django.contrib import admin
from .models import ReqsRecipient

@admin.register(ReqsRecipient)
class ReqsRecipientAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order', 'name')
    search_fields = ('email', 'name')
