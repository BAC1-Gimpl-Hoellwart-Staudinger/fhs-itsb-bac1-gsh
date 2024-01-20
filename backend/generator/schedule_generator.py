import random
from datetime import timedelta
from timeit import default_timer as timer

from .helper_functions import check_holiday, string_to_date


class ScheduleGenerator:
    @staticmethod
    def generate_sample_schedule(start_date, end_date, employees):
        delta = timedelta(days=1)
        start_date = start_date.date()
        end_date = end_date.date()
        execution_time_start = timer()

        schedule = []
        vac_schedule = []

        for employee in employees:
            vac_schedule.append([string_to_date(date) for date in employee['vacation_schedule']])

        for s in vac_schedule:
            for i in range(len(s)):
                s[i] = s[i].date()
        while start_date < end_date:
            employee = random.choice(employees)
            vac_schedule_tmp = vac_schedule[employee['id']-1]
            while check_holiday(start_date, vac_schedule_tmp) is not True:
                employee = random.choice(employees)
                vac_schedule_tmp = vac_schedule[employee['id']-1]
            schedule.append(employee['id'])
            start_date += delta

        execution_time_end = timer()
        execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)

        return schedule, execution_time_ms
