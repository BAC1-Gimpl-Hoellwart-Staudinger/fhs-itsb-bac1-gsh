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
                'weekend_holiday_days': 0
            })

        start_date = metadata['start_date']
        end_date = metadata['end_date']

        num_days = (end_date - start_date).days

        holiday_days = get_austrian_holidays_dates(start_date, end_date)

        for i, empl_id_day in enumerate(schedule):
            # could be nicer with filter or where
            for empl_stat in per_empl_stats:
                if empl_stat['id'] == empl_id_day:
                    empl_stat['sum_days']+=1

            date = start_date + timedelta(days=i)
            if date.weekday() < 5 and date not in holiday_days:
                for empl_stat in per_empl_stats:
                    if empl_stat['id'] == empl_id_day:
                        empl_stat['work_days']+=1
            else:
                for empl_stat in per_empl_stats:
                    if empl_stat['id'] == empl_id_day:
                        empl_stat['weekend_holiday_days']+=1
        # this could be in one of the previous loops
        acfs = Stats.calculate_acfs(schedule)
        # again liniear search, could be nicer
        for empl_stat in per_empl_stats:
            for acf in acfs:
                if empl_stat['id'] == acf['id']:
                    empl_stat['acf'] = acf['acf']


        stats = {
            "total_days": num_days,
            "total_employees": cnt_empl,
            "per_employee": per_empl_stats
        }

        return stats

    @staticmethod
    def calculate_acfs(schedule):
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
        
        acfs = []
        for empl_schedule in schedules_per_employee:
            acf = Stats.calculate_acf(empl_schedule['schedule'])
            acfs.append({"id":empl_schedule['id'], "acf":acf})
        return acfs

    @staticmethod
    def calculate_acf(schedule):
        acf = []
        s = pd.Series(schedule)
        for i in range(int(len(schedule)/2)):
            acf.append(s.autocorr(lag=i))
        return acf

    @staticmethod
    def get_created_at_date_format():
        return "%Y-%m-%d %H:%M:%S:%f"