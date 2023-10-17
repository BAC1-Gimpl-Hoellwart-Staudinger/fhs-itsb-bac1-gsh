import random
import os
import json
import re
import holidays
from faker import Faker
from datetime import timedelta, datetime


def generate_dataset(num_employees, start_date, end_date, min_vacation_days, max_vacation_days):
    if start_date > end_date:
        raise ValueError("Start date must be before end date.")
    if min_vacation_days < 0 or max_vacation_days < 0:
        raise ValueError("Vacation days must be positive.")
    if min_vacation_days > max_vacation_days:
        raise ValueError("Minimum vacation days must be smaller than maximum vacation days.")

    dataset = {
        "start_date": str(start_date),
        "end_date": str(end_date),
    }
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
            employee_vacation_schedule.append(str(random_holiday))

        # also picks random vacation days, within the given range (-1 because of the random holiday), no duplicates
        for _ in range(random.randint(min_vacation_days, max_vacation_days - 1)):
            while True:
                random_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
                if random_date not in already_picked_holidays:
                    already_picked_holidays.append(random_date)
                    employee_vacation_schedule.append(random_date.strftime("%Y-%m-%d"))
                    break

        employees.append({
            "id": employee_id,
            "name": employee_name,
            "vacation_schedule": employee_vacation_schedule
        })
    dataset["employees"] = employees

    return dataset


def generate_random_names(num_employees):
    faker = Faker('de_DE')
    random_names = []

    for _ in range(num_employees):
        # only append random name, if it is not already in the list and has no special characters
        while True:
            full_random_name = faker.name()
            if (full_random_name not in random_names) and re.match(r"^[a-zA-Z\s]*$", full_random_name):
                random_names.append(full_random_name)
                break

    return random_names


def get_austrian_holidays_dates(start_date, end_date):
    austrian_holidays = []
    holidays_at = holidays.AT(years=[start_date.year, end_date.year])

    for date_hat in holidays_at:
        austrian_holidays.append(date_hat)

    return austrian_holidays


def dump_dataset(dataset, output_directory="output", file_name="dataset.json"):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    file_path = os.path.join(output_directory, file_name)

    with open(file_path, "w") as json_output_file:
        json.dump(dataset, json_output_file, indent=4)


def generate_schedule(start_date, end_date, input_directory="output", file_name="dataset.json"):
    file_path = os.path.join(input_directory, file_name)

    with open(file_path, "r") as json_input_file:
        data = json.load(json_input_file)
    employees = data['employees']

    delta = timedelta(days=1)
    start__date = datetime.strptime(start_date, '%Y-%m-%d')
    end__date = datetime.strptime(end_date, '%Y-%m-%d')

    schedule = []

    while start__date <= end__date:
        start__date += delta
        tmp_employee = random.choice(employees)
        vacation_schedule = [datetime.strptime(date, '%Y-%m-%d') for date in tmp_employee['vacation_schedule']]
        while check_holiday(start__date, vacation_schedule) is not True:
            tmp_employee = random.choice(employees)
            vacation_schedule = [datetime.strptime(date, '%Y-%m-%d') for date in tmp_employee['vacation_schedule']]
        schedule.append(tmp_employee['id'])
    print(f'Schedule length: {len(schedule)}')


def check_holiday(start_date, vacation_schedule):
    return start_date not in vacation_schedule
