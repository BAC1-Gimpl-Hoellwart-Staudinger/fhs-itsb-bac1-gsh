from django.http import JsonResponse
from rest_framework.decorators import api_view
from .employee_generator import EmployeeGenerator
from .schedule_generator import ScheduleGenerator
from .helper_functions import string_to_date, date_to_formatted_string
from datetime import date, datetime


@api_view(['GET'])
def generate_data(request):
    start_date_param = request.query_params.get('startDate')
    end_date_param = request.query_params.get('endDate')
    num_employee_param = request.query_params.get('numEmployees')

    if start_date_param is None or end_date_param is None or num_employee_param is None:
        return JsonResponse({
            'error': 'startDate, endDate, and numEmployees are required query parameters'
        }, status=400)

    try:
        num_employee = int(request.query_params.get('numEmployees'))
    except ValueError:
        return JsonResponse({
            'error': 'numEmployees must be an integer'
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

    min_employees = 2
    max_employees = 10

    if num_employee < min_employees or num_employee > max_employees:
        return JsonResponse({
            'error': f'numEmployees must be between {min_employees} and {max_employees}'
        }, status=400)

    min_vacation_days = 2
    max_vacation_days = 10

    employees = EmployeeGenerator.generate(
        num_employee, start_date, end_date, min_vacation_days, max_vacation_days
    )
    schedule = ScheduleGenerator.generate(start_date=str(start_date_param), end_date=str(end_date_param), dataset=employees)

    # TODO: maybe add the execution time it took to generate the data in dataset.metadata
    dataset = {
        "metadata": {
            "startDate": date_to_formatted_string(start_date),
            "endDate": date_to_formatted_string(end_date),
            "created_at": date.strftime(datetime.now(), "%Y-%m-%d %H:%M:%S:%f"),
        },
        "schedule": schedule,
    }
    return JsonResponse(dataset, safe=False)
