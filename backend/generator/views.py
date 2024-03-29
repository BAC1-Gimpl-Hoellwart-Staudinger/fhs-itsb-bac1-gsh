from django.http import JsonResponse
from datetime import date, datetime
import json
from .employee_generator import EmployeeGenerator
from .genetic_algorithm import GeneticAlgorithm
from .genetic_algorithm2 import GeneticAlgorithm2
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

        min_period_months = 2

        if (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month) < min_period_months:
            return JsonResponse({
                'error': f'startDate and endDate must be at least {min_period_months} months apart'
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
        metadata_body = json_data.get('metadata', None)
        start_date_body = metadata_body.get('start_date', None)
        end_date_body = metadata_body.get('end_date', None)
        created_at_date_body = metadata_body.get('created_at_date', None)
        employees_body = metadata_body.get('employees', None)
        algorithm_version = metadata_body.get('algorithm_version', None)

        if (metadata_body is None or start_date_body is None or end_date_body is None
                or created_at_date_body is None or employees_body is None or algorithm_version is None):
            return JsonResponse({
                'error': 'metadata, start_date, end_date, created_at_date, employees, algo_version are required body parameters'
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
            "start_date": date_to_formatted_string(start_date),
            "end_date": date_to_formatted_string(end_date),
            "created_at_date": date.strftime(created_at_date, EmployeeGenerator.get_created_at_date_format()),
            "employees": employees_body
        }

        try:
            algorithm_version = int(algorithm_version)
        except ValueError:
            return JsonResponse({
                    'error': 'algo_version must be an integer'
                }, status=400)

        if algorithm_version == 1:
            schedule, execution_time_ms, last_fitness = GeneticAlgorithm.genetic_algorithm(start_date, end_date, metadata_body)
        elif algorithm_version == 2:
            schedule, execution_time_ms, last_fitness = GeneticAlgorithm2.genetic_algorithm(start_date, end_date, metadata_body)
        else:
            return JsonResponse({
                    'error': 'algo_version must be 1 or 2'
                }, status=400)

        metadata['algorithm_execution_time_ms'] = execution_time_ms
        metadata['fitness_of_schedule'] = last_fitness

        dataset = {
            "metadata": metadata,
            "schedule": schedule
        }

        return JsonResponse(dataset, safe=False)
