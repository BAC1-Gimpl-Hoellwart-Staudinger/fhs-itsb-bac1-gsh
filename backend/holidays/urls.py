from django.urls import path
from . import views

urlpatterns = [
    path('holidays', views.holidays, name='holidays'),
]