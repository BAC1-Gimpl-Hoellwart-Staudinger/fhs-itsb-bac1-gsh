from django.urls import path
from . import views

urlpatterns = [
    path('austrianHolidays/', views.austrian_holidays, name='austrianHolidays'),
]
