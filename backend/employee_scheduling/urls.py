from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('generator.urls')),
    path('api/', include('stats.urls')),
    path('api/', include('austrian_holidays.urls')),
]
