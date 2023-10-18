from django.http import JsonResponse
from rest_framework.decorators import api_view
import holidays


@api_view(['GET'])
def get_austrian_holidays(request):
    data = dict(holidays.Austria(years=2021).items())

    data = {str(key): str(value) for key, value in data.items()}

    return JsonResponse(data, safe=False)
