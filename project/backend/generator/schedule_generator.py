import random
import os
import json
from datetime import timedelta
from helper_functions import check_holiday, string_to_date


class ScheduleGenerator:
    @staticmethod
    def generate(start_date, end_date, input_directory="output", file_name="dataset.json"):
        file_path = os.path.join(input_directory, file_name)

        with open(file_path, "r") as json_input_file:
            data = json.load(json_input_file)
        employees = data['employees']

        delta = timedelta(days=1)
        start__date = string_to_date(start_date)
        end__date = string_to_date(end_date)

        schedule = []

        while start__date <= end__date:
            start__date += delta
            tmp_employee = random.choice(employees)
            vacation_schedule = [string_to_date(date) for date in tmp_employee['vacation_schedule']]
            while check_holiday(start__date, vacation_schedule) is not True:
                tmp_employee = random.choice(employees)
                vacation_schedule = [string_to_date(date) for date in tmp_employee['vacation_schedule']]
            schedule.append(tmp_employee['id'])
        print(f'Schedule length: {len(schedule)}')
