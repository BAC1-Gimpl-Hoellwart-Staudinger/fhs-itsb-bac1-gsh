import random
import os
import json
import re
import holidays
import uuid
from faker import Faker
from datetime import timedelta


def generate_dataset(num_employees, start_date, end_date, max_vacation_days):
    dataset = {
        "num_employees": num_employees,
    }
    random_names = generate_random_names(num_employees)
    austrian_holidays = get_austrian_holidays_dates(start_date, end_date)

    employees = []
    picked_holidays = []
    for _ in range(num_employees):
        employee_id = str(uuid.uuid4())
        employee_name = random_names.pop()
        employee_vacation_schedule = []

        # employee picks one random holiday for their vacation schedule
        if len(austrian_holidays) > 0:
            random_holiday = austrian_holidays.pop(austrian_holidays.index(random.choice(austrian_holidays)))
            employee_vacation_schedule.append(str(random_holiday))

        # also picks random vacation days, within the given range (-1 because of the random holiday), no duplicates
        for _ in range(random.randint(0, max_vacation_days - 1)):
            while True:
                random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                if random_date not in picked_holidays:
                    picked_holidays.append(random_date)
                    employee_vacation_schedule.append(random_date.strftime("%Y-%m-%d"))
                    break

        employees.append({
            "id": employee_id,
            "name": employee_name,
            "vacation_schedule": employee_vacation_schedule
        })
    dataset["employees"] = employees

    return dataset


def generate_random_names(n):
    faker = Faker('de_DE')
    random_names = []

    for _ in range(n):
        # only append random name, if it is not already in the list and has no special characters
        while True:
            full_random_name = faker.name()
            if full_random_name not in random_names and re.match("^[a-zA-Z\s]*$", full_random_name):
                random_names.append(full_random_name)
                break

    return random_names


def get_austrian_holidays_dates(start_date, end_date):
    austrian_holidays = []
    holidays_ = holidays.AT(years=[start_date.year, end_date.year])

    for date in holidays_:
        austrian_holidays.append(date)

    return austrian_holidays


def dump_dataset(dataset):
    output_directory = "output"
    file_name = "dataset.json"

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    file_path = os.path.join(output_directory, file_name)

    with open(file_path, 'w') as json_output_file:
        json.dump(dataset, json_output_file, indent=4)
