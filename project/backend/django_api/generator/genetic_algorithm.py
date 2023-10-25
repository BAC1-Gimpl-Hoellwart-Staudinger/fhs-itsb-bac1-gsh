from datetime import timedelta
from .helper_functions import string_to_date,get_austrian_holidays_dates
import numpy as np
from .schedule_generator import ScheduleGenerator


class GeneticAlgorithm:
    @staticmethod
    def genetic_algorithm(start_date, end_date, metadata_body):
        population = GeneticAlgorithm.generate_population(start_date,end_date,metadata_body,1000)
        rankedschedules = []
        for s in population:
            rankedschedules.append((GeneticAlgorithm.fitness(s, start_date, end_date, metadata_body),s))
        rankedschedules.sort()

    @staticmethod
    def generate_population(start_date, end_date, metadata_body,size):
        population = []
        for _ in range(size):
            population.append(ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0])
        return population

    @staticmethod
    def fitness(schedule, start_date, end_date, data):
        delta = timedelta(days=1)
        employees = data['employees']
        start__date = start_date.date()
        end__date = end_date.date()
        weekdays = []
        weekends = []
        holidays = []
        holiday_list = get_austrian_holidays_dates(start__date, end__date)
        for _ in range(len(employees)):
            weekdays.append(0)
            weekends.append(0)
            holidays.append(0)
        counter = 0
        while start__date <= end__date:
            day = start__date.weekday()
            if day == 5 or day == 6:
                weekends[schedule[counter]-1] += 1
            else:
                weekdays[schedule[counter]-1] += 1
            if start__date in holiday_list:
                holidays[schedule[counter]-1] += 1
            counter += 1
            start__date += delta

        mean_weekdays = np.mean(weekdays)
        mean_weekends = np.mean(weekends)
        mean_holidays = np.mean(holidays)
        deviation_weekdays = 0
        deviation_weekends = 0
        deviation_holidays = 0

        for s in zip(weekdays, weekends,holidays):
            deviation_weekdays += abs(mean_weekdays - s[0])
            deviation_weekends += abs(mean_weekends - s[1])
            deviation_holidays += abs(mean_holidays - s[2])
        return (deviation_weekdays * 10) + (deviation_weekends * 50) + (deviation_holidays * 100)
