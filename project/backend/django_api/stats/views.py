from django.http import JsonResponse
from datetime import datetime
import json

from .stats_calc import Stats
from generator.helper_functions import string_to_date


def stats(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST requests are allowed'
        }, status=405)

    json_data = json.loads(request.body.decode('utf-8'))
    metadata_body = json_data.get('metadata', None)
    start_date_body = metadata_body.get('start_date', None)
    end_date_body = metadata_body.get('end_date', None)
    created_at_date_body = metadata_body.get('created_at_date', None)
    algorithm_version_body = metadata_body.get('algorithm_version', None)
    employees_body = metadata_body.get('employees', None)
    execution_time_ms = metadata_body.get('algorithm_execution_time_ms', None)

    schedule = json_data.get('schedule', None)

    if (metadata_body is None or start_date_body is None or end_date_body is None or schedule is None
            or created_at_date_body is None or employees_body is None or execution_time_ms is None or algorithm_version_body is None):
        return JsonResponse({
            'error': 'metadata, start_date, end_date, created_at_date, employees, schedule, algorithm_version and schedule are required body parameters'
        }, status=400)

    created_at_date_format = Stats.get_created_at_date_format()

    try:
        start_date = string_to_date(start_date_body)
        end_date = string_to_date(end_date_body)
        created_at_date = datetime.strptime(created_at_date_body, created_at_date_format)
    except ValueError:
        return JsonResponse({
            'error': f'start_date, end_date must be in YYYY-MM-DD and'
                     f'create_at_date must be in {created_at_date_format} format'
        }, status=400)

    if len(employees_body) < 0:
        return JsonResponse({
            'error': 'employees array cannot be empty'
        }, status=400)

    for employee in employees_body:
        if employee['id'] is None or employee['name'] is None or employee['vacation_schedule'] is None:
            return JsonResponse({
                'error': 'employees array must contain id, name, and vacation_schedule'
            }, status=400)

        try:
            int(employee['id'])
        except ValueError:
            return JsonResponse({
                'error': 'employee id must be an integer'
            }, status=400)


    metadata = {
        "start_date": start_date,
        "end_date": end_date,
        "created_at_date": created_at_date,
        "employees": employees_body
    }

    try:
        stats = Stats.calculate(metadata, schedule)
    except Exception as e:
        return JsonResponse({
            'error': f'Error calculating stats: {e}'
        }, status=400)

    dataset = {
        "metadata": metadata_body,
        "stats": stats
    }

    return JsonResponse(dataset, safe=False)
