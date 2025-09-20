from django.urls import path
from .views import HomePage, CompanyPage, SolutionsPage

urlpatterns = [
    path('', HomePage, name='home'),
    path('company/', CompanyPage, name='company'),
    path('solutions/', SolutionsPage, name='solutions'),
]