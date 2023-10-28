from django.http import JsonResponse
from datetime import date, datetime
import json

from .stats_calc import Stats
from .helper_functions import string_to_date


def stats(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST requests are allowed'
        }, status=405)

    json_data = json.loads(request.body.decode('utf-8'))
    metadata_body = json_data['metadata']
    start_date_body = metadata_body['start_date']
    end_date_body = metadata_body['end_date']
    created_at_date_body = metadata_body['created_at_date']
    employees_body = metadata_body['employees']

    schedule = json_data['schedule']
    execution_time_ms = metadata_body['algorithm_execution_time_ms']

    if (metadata_body is None or start_date_body is None or end_date_body is None or schedule is None
            or created_at_date_body is None or employees_body is None):
        return JsonResponse({
            'error': 'metadata, start_date, end_date, created_at_date, employees and schedule are required body parameters'
        }, status=400)

    created_at_date_format = Stats.get_created_at_date_format()

    try:
        start_date = string_to_date(start_date_body)
        end_date = string_to_date(end_date_body)
        created_at_date = datetime.strptime(created_at_date_body, created_at_date_format)
    except ValueError:
        return JsonResponse({
            'error': f'start_date {start_date}, end_date must be in YYYY-MM-DD and'
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
    if execution_time_ms is not None:
        metadata['algorithm_execution_time_ms'] = execution_time_ms

    try:
        stats = Stats.calculate(metadata, schedule)
    except Exception as e:
        return JsonResponse({
            'error': f'Error calculating stats: {e}'
        }, status=400)

    dataset = {
        "metadata": metadata,
        #"schedule": schedule,
        "stats": stats
    }

    return JsonResponse(dataset, safe=False)
