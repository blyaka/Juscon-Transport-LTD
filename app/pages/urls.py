from django.urls import path
from .views import HomePage, FormPage

urlpatterns = [
    path('', HomePage, name='home'),
    path('form/', FormPage, name='form'),
]