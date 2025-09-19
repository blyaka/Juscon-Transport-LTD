from django.urls import path
from .views import HomePage, CompanyPage

urlpatterns = [
    path('', HomePage, name='home'),
    path('company/', CompanyPage, name='company'),
]