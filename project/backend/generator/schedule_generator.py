import random
from datetime import timedelta
from helper_functions import check_holiday, string_to_date


class ScheduleGenerator:
    @staticmethod
    def generate(start_date, end_date, dataset):

        employees = dataset['employees']
        delta = timedelta(days=1)
        start__date = string_to_date(start_date)
        end__date = string_to_date(end_date)

        schedule = []
        vac_schedule = []
        for i in employees:
            vac_schedule.append([string_to_date(date) for date in i['vacation_schedule']])

        while start__date <= end__date:
            start__date += delta
            tmp_employee = random.choice(employees)
            vac_schedule_tmp = vac_schedule[tmp_employee['id']-1]
            while check_holiday(start__date, vac_schedule_tmp) is not True:
                tmp_employee = random.choice(employees)
                vac_schedule_tmp = vac_schedule[tmp_employee['id']-1]
            schedule.append(tmp_employee['id'])
        return schedule
        #  print(f'Schedule length: {len(schedule)}')
