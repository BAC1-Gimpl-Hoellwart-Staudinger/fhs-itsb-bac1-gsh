from django.http import JsonResponse
from rest_framework.decorators import api_view
from datetime import date
from .employee_generator import EmployeeGenerator
from .schedule_generator import ScheduleGenerator


@api_view(['GET'])
def generate_data(request):
    num_employees = 4
    start_date = date(2024, 1, 1)
    end_date = date(2024, 12, 31)
    min_vacation_days = 2
    max_vacation_days = 10


    employees = EmployeeGenerator.generate(num_employees, start_date, end_date, min_vacation_days, max_vacation_days)
    schedule = []
    schedule.append(ScheduleGenerator.generate(start_date=str(start_date), end_date=str(end_date), dataset=employees))

    dataset = { "metadata": employees, "schedule": schedule}
    return JsonResponse(dataset, safe=False)
