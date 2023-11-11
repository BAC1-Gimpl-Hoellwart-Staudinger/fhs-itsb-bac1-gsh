from datetime import timedelta
import pandas as pd

from generator.helper_functions import get_austrian_holidays_dates

class Stats:
    @staticmethod
    def calculate(metadata, schedule):
        cnt_empl = len(metadata['employees'])

        empl_id_name = {}
        per_empl_stats = []
        for empl in metadata['employees']:
            empl_id_name[empl['id']] = empl['name']
            per_empl_stats.append({
                'id': empl['id'],
                'sum_days': 0,
                'work_days': 0,
                'weekend_holiday_days': 0,
                'weekdays_worked': {
                    'non_holiday': [0] * 7,
                    'holidays': [0] * 7
                }
            })

        start_date = metadata['start_date']
        end_date = metadata['end_date']

        num_days = (end_date - start_date).days

        holiday_days = get_austrian_holidays_dates(start_date, end_date)

        for i, empl_id_day in enumerate(schedule):
            date = start_date + timedelta(days=i)
            date = date.date()

            # general workday / weekend / holiday count
            if date.weekday() < 5 and date not in holiday_days:
                list(filter(lambda one_empl_stat: one_empl_stat['id'] == empl_id_day, per_empl_stats))[0]['work_days']+=1
            else:
                list(filter(lambda one_empl_stat: one_empl_stat['id'] == empl_id_day, per_empl_stats))[0]['weekend_holiday_days']+=1

            # workday / weekend / holiday cout per weekday
            if date in holiday_days:
                list(filter(lambda one_empl_stat: one_empl_stat['id'] == empl_id_day, per_empl_stats))[0]['weekdays_worked']['holidays'][date.weekday()] += 1
            else:
                list(filter(lambda one_empl_stat: one_empl_stat['id'] == empl_id_day, per_empl_stats))[0]['weekdays_worked']['non_holiday'][date.weekday()] += 1

        for empl_stat in per_empl_stats:
            empl_stat['sum_days'] = empl_stat['work_days'] + empl_stat['weekend_holiday_days']
        
        acfs = Stats.calculate_acfs(schedule)

        for acf in acfs:
            list(filter(lambda one_empl_stat: one_empl_stat['id'] == acf['id'], per_empl_stats))[0]['acf'] = acf['acf']

        stats = {
            "total_days": num_days,
            "total_employees": cnt_empl,
            "per_employee": per_empl_stats
        }

        return stats
    
    @staticmethod
    def get_sub_schedules(schedule):
        ids = []
        for id in schedule:
            if id not in ids:
                ids.append(id)

        schedules_per_employee = []

        for id in ids:
            sub_schedule = []
            for day_empl_id in schedule:
                if day_empl_id == id:
                    sub_schedule.append(1)
                else:
                    sub_schedule.append(0)

            schedules_per_employee.append({"id":id, "schedule":sub_schedule})
        return schedules_per_employee

    @staticmethod
    def calculate_acfs(schedule):
        schedules_per_employee = Stats.get_sub_schedules(schedule)
        
        acfs = []
        for empl_schedule in schedules_per_employee:
            acf = Stats.calculate_acf(empl_schedule['schedule'])
            acfs.append({"id":empl_schedule['id'], "acf":acf})
        return acfs

    @staticmethod
    def calculate_acf(schedule):
        size = len(schedule)
        rxx = [0] * (2 * size - 1)
        for k in range(size):
            rxx[size-1+k] = 0
            for i in range(size-k):
                rxx[size-1+k] += schedule[i] * schedule[i+k]
            rxx[size-1+k] /= size - k
        
        for i in range(size):
            rxx[size-1-i] = rxx[size-1+i]
        
        return rxx

        

    @staticmethod
    def get_created_at_date_format():
        return "%Y-%m-%d %H:%M:%S:%f"