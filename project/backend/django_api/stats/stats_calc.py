from datetime import timedelta

from generator.helper_functions import get_austrian_holidays_dates

class Stats:
    @staticmethod
    def calculate(metadata, schedule):
        cnt_empl = len(metadata['employees'])

        empl_id_name = {}
        days_worked = {}
        for empl in metadata['employees']:
            empl_id_name[empl['id']] = empl['name']
            days_worked[empl['id']] = {
                'sum': 0,
                'work_days': 0,
                'weekend_holiday_days': 0
            }

        start_date = metadata['start_date']
        end_date = metadata['end_date']

        num_days = (end_date - start_date).days

        holiday_days = get_austrian_holidays_dates(start_date, end_date)

        for i, empl_id_day in enumerate(schedule):
            days_worked[empl_id_day]['sum']+=1
            date = start_date + timedelta(days=i)
            if date.weekday() < 5 and date not in holiday_days:
                days_worked[empl_id_day]['work_days']+=1
            else:
                days_worked[empl_id_day]['weekend_holiday_days']+=1

        stats = {
            "total_days": num_days,
            "total_employees": cnt_empl,
            "days_worked_per_employee": days_worked,
        }

        return stats



    @staticmethod
    def get_created_at_date_format():
        return "%Y-%m-%d %H:%M:%S:%f"