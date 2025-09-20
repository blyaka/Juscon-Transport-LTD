from django.shortcuts import render


def HomePage(request):
    return render(request, 'home.html')

def SolutionsPage(request):
    return render(request, 'solutions.html')

def CompanyPage(request):
    return render(request, 'company.html')

def Custom404(request, exception):
            return render(request, '404.html', status=404)