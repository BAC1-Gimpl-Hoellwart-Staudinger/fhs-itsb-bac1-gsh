from django.http import JsonResponse
from generator.helper_functions import date_to_formatted_string, string_to_date, get_austrian_holidays


def austrian_holidays(request):
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

    austrian_holidays_dates = get_austrian_holidays(start_date, end_date)

    holidays_array = []

    for date, name in austrian_holidays_dates.items():
        holidays_array.append({
            'date': date_to_formatted_string(date),
            'name': name
        })

    holidays_array.sort(key=lambda x: x['date'])

    return JsonResponse({
        'austrianHolidays': holidays_array
    }, status=200)
