import random
import os
import json
from datetime import timedelta
from .helper_functions import date_to_formatted_string, generate_random_names, get_austrian_holidays_dates


class EmployeeGenerator:
    @staticmethod
    def generate(num_employees, start_date, end_date, min_vacation_days, max_vacation_days):
        if start_date > end_date:
            raise ValueError("Start date must be before end date.")
        if min_vacation_days < 0 or max_vacation_days < 0:
            raise ValueError("Vacation days must be positive.")
        if min_vacation_days > max_vacation_days:
            raise ValueError("Minimum vacation days must be smaller than maximum vacation days.")

        dataset = {}
        random_names = generate_random_names(num_employees)
        austrian_holidays = get_austrian_holidays_dates(start_date, end_date)

        employees = []
        already_picked_holidays = []
        seq = 0
        for _ in range(num_employees):
            seq += 1
            employee_id = seq
            employee_name = random_names.pop()
            employee_vacation_schedule = []

            # employee picks one random austrian holiday for their vacation schedule
            if len(austrian_holidays) > 0:
                random_holiday = austrian_holidays.pop(austrian_holidays.index(random.choice(austrian_holidays)))
                already_picked_holidays.append(random_holiday)
                employee_vacation_schedule.append(date_to_formatted_string(random_holiday))

            # also picks random vacation days, within the given range (-1 because of the random holiday), no duplicates
            for _ in range(random.randint(min_vacation_days, max_vacation_days - 1)):
                while True:
                    random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                    if random_date not in already_picked_holidays:
                        already_picked_holidays.append(random_date)
                        employee_vacation_schedule.append(date_to_formatted_string(random_date))
                        break

            employees.append({
                "id": employee_id,
                "name": employee_name,
                "vacation_schedule": employee_vacation_schedule
            })
        dataset["employees"] = employees

        return dataset

    @staticmethod
    def dump_json(dataset, output_directory="output", file_name="dataset.json"):
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)

        file_path = os.path.join(output_directory, file_name)

        with open(file_path, "w") as json_output_file:
            json.dump(dataset, json_output_file, indent=4)

        print("Successfully generated dataset.")
