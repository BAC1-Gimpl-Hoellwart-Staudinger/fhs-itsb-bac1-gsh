import re
import holidays
from faker import Faker
from datetime import datetime


def date_to_formatted_string(date):
    return date.strftime("%Y-%m-%d")


def string_to_date(date_string):
    try:
        return datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise


def generate_random_names(num_employees):
    faker = Faker('de_DE')
    random_names = []

    for _ in range(num_employees):
        # only append random name, if it is not already in the list and has no special characters
        while True:
            full_random_name = faker.name()
            if (full_random_name not in random_names) and re.match(r"^[a-zA-Z\s]*$", full_random_name) and "Herr" not in full_random_name and "Frau" not in full_random_name:
                random_names.append(full_random_name)
                break

    return random_names


def get_austrian_holidays(start_date, end_date):
    return holidays.AT(years=[start_date.year, end_date.year])


def get_austrian_holidays_dates(start_date, end_date):
    austrian_holidays = []
    holidays_at = holidays.AT(years=[start_date.year, end_date.year])

    for date_hat in holidays_at:
        austrian_holidays.append(date_hat)

    return austrian_holidays


def check_holiday(start_date, vacation_schedule):
    return start_date not in vacation_schedule
