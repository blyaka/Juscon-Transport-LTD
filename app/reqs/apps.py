from django.apps import AppConfig

class ReqsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reqs'
    verbose_name = 'Обратная связь'

    def ready(self):
        from . import signals
