from datetime import timedelta, date
import numpy as np
import random
from timeit import default_timer as timer

from stats.helper_functions import string_to_date

class Stats:
    @staticmethod
    def calculate(metadata, schedule):
        cnt_empl = len(metadata['employees'])

        empl_id_name = {}
        for empl in metadata['employees']:
            empl_id_name[empl['id']] = empl['name']

        start_date = string_to_date(metadata['start_date'])
        end_date = string_to_date(metadata['end_date'])    

        num_days = (end_date - start_date).days + 1

        days_worked = {}
        for empl_id_day in schedule:
            days_worked[empl_id_day]+=1

        most_working_employee = max(days_worked)
        most_working_employee_name = empl_id_name[most_working_employee]
        least_working_employee = min(days_worked)
        least_working_employee_name = empl_id_name[least_working_employee]

        stats = {
            "total_days": num_days,
            "total_employees": cnt_empl,
            "days_worked_per_employee": days_worked,
            "most_working_employee": most_working_employee_name,
            "least_working_employee": least_working_employee_name,
            "most_working_employee_days": days_worked[most_working_employee],
            "least_working_employee_days": days_worked[least_working_employee]
        }
        # TODO add weekend and holiday stats ...

        return stats



    @staticmethod
    def get_created_at_date_format():
        return "%Y-%m-%d %H:%M:%S:%f"