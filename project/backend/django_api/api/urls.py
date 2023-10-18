from django.urls import path
from . import views

urlpatterns = [
    path('ath', views.get_austrian_holidays)
]
