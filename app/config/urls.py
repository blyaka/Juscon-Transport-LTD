from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from reqs.views import feedback_submit


from django.shortcuts import render

handler404 = 'pages.views.Custom404'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('pages.urls')),
    path('404/', lambda request: render(request, '404.html'), name='404'),
    path('api/feedback/', feedback_submit, name='feedback_submit'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)