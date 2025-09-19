from django.shortcuts import render


def HomePage(request):
    return render(request, 'home.html')

def FormPage(request):
    return render(request, 'form.html')

def Custom404(request, exception):
            return render(request, '404.html', status=404)