from django.urls import path
from .views import RegisterIris, VerifyIris

urlpatterns = [
    path('register/', RegisterIris.as_view()),
    path('verify/', VerifyIris.as_view()),
]