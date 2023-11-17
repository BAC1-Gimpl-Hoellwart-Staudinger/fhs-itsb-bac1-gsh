from django.http import JsonResponse
from generator.helper_functions import string_to_date, get_austrian_holidays_dates


def holidays(request):
    if request.method != 'GET':
        return JsonResponse({
            'error': 'Only GET requests are allowed'
        }, status=405)

    start_date_param = request.GET.get('startDate')
    end_date_param = request.GET.get('endDate')

    if start_date_param is None or end_date_param is None:
        return JsonResponse({
            'error': 'startDate and endDate are required query parameters'
        }, status=400)

    try:
        start_date = string_to_date(start_date_param)
        end_date = string_to_date(end_date_param)
    except ValueError:
        return JsonResponse({
            'error': 'startDate and endDate must be in the format YYYY-MM-DD'
        }, status=400)

    if start_date > end_date:
        return JsonResponse({
            'error': 'startDate must be before endDate'
        }, status=400)

    austrian_holidays_dates = get_austrian_holidays_dates(start_date, end_date)

    print(austrian_holidays_dates)

    return JsonResponse({
        'error': 'Not implemented'
    }, status=501)
