from django.http import JsonResponse
from datetime import date, datetime
import json

from .employee_generator import EmployeeGenerator
from .schedule_generator import ScheduleGenerator
from .genetic_algorithm import GeneticAlgorithm
from .helper_functions import string_to_date, date_to_formatted_string


def generate(request):
    if request.method == 'GET':
        start_date_param = request.GET.get('startDate')
        end_date_param = request.GET.get('endDate')
        num_employees_param = request.GET.get('numEmployees')

        if start_date_param is None or end_date_param is None or num_employees_param is None:
            return JsonResponse({
                'error': 'startDate, endDate, and numEmployees are required query parameters'
            }, status=400)

        try:
            num_employees = int(request.GET.get('numEmployees'))
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

        if num_employees < min_employees or num_employees > max_employees:
            return JsonResponse({
                'error': f'numEmployees must be between {min_employees} and {max_employees}'
            }, status=400)

        min_vacation_days = 2
        max_vacation_days = 10

        employees = EmployeeGenerator.generate(num_employees, start_date, end_date, min_vacation_days, max_vacation_days)

        dataset = {
            "metadata": {
                "start_date": date_to_formatted_string(start_date),
                "end_date": date_to_formatted_string(end_date),
                "created_at_date": date.strftime(datetime.now(), EmployeeGenerator.get_created_at_date_format()),
                "employees": employees
            }
        }
        return JsonResponse(dataset, safe=False)

    elif request.method == 'POST':
        json_data = json.loads(request.body.decode('utf-8'))
        metadata_body = json_data['metadata']
        start_date_body = metadata_body['start_date']
        end_date_body = metadata_body['end_date']
        created_at_date_body = metadata_body['created_at_date']
        employees_body = metadata_body['employees']

        if (metadata_body is None or start_date_body is None or end_date_body is None
                or created_at_date_body is None or employees_body is None):
            return JsonResponse({
                'error': 'metadata, start_date, end_date, created_at_date, and employees are required body parameters'
            }, status=400)

        created_at_date_format = EmployeeGenerator.get_created_at_date_format()

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

        # TODO: implement genetic algorithm and replace this sample schedule
        schedule, execution_time_ms = ScheduleGenerator.generate_sample_schedule(start_date, end_date, employees_body)
#        fitness_of_schedule = GeneticAlgorithm.fitness(schedule, start_date, end_date, employees_body)
 #       print(fitness_of_schedule)

        metadata['algorithm_execution_time_ms'] = execution_time_ms
        dataset = {
            "metadata": metadata,
            "schedule": schedule
        }

        return JsonResponse(dataset, safe=False)
