from datetime import datetime
import holidays

def string_to_date(date_string):
    try:
        return datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        raise

def get_austrian_holidays_dates(start_date, end_date):
    austrian_holidays = []
    holidays_at = holidays.AT(years=[start_date.year, end_date.year])

    for date_hat in holidays_at:
        austrian_holidays.append(date_hat)

    return austrian_holidays
