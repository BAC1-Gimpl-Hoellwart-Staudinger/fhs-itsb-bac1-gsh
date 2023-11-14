from datetime import timedelta
import time
from .helper_functions import string_to_date, get_austrian_holidays_dates
import numpy as np
import random
from timeit import default_timer as timer
from .schedule_generator import ScheduleGenerator


class GeneticAlgorithm:
    @staticmethod
    def genetic_algorithm(start_date, end_date, metadata_body):
        random.seed(time.time())
        populationSize = 50
        execution_time_start = timer()
        population = GeneticAlgorithm.generate_population(start_date, end_date, metadata_body, populationSize * 2)
        num_employees = len(metadata_body['employees'])

        for gen in range(5000):
            rankedschedules = GeneticAlgorithm.eval_fitness(population, start_date, end_date, metadata_body)
            rankedschedules = rankedschedules[:populationSize]
            newschedule = []

            if gen % 10 == 0:
                print(
                    f'<=== Population Size: {len(rankedschedules)} Best Solution Gen ({gen}): {rankedschedules[0][0]} ==> ')

            if rankedschedules[0][0] <= num_employees * 55:
                execution_time_end = timer()
                execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
                print(
                    f'<=== Population Size: {len(rankedschedules)} Best Solution Gen ({gen}): {rankedschedules[0][0]} ==> ')
                return rankedschedules[0][1], execution_time_ms

            for s in rankedschedules:
                if s[0] < num_employees * 1000:
                    newschedule.append(s[1])
            for _ in range(int(populationSize * 0.5)):
                tmp_listelem1 = newschedule[random.randint(0,len(newschedule)-1)]#random.choice(newschedule)
                tmp_listelem2 = newschedule[random.randint(0,len(newschedule)-1)]#random.choice(newschedule)
                elem1 = tmp_listelem1[0:int(len(tmp_listelem1) / 2)]
                elem2 = tmp_listelem2[int(len(tmp_listelem2) / 2):len(tmp_listelem2)]
                tmp_listelem = elem1 + elem2
                if random.randint(1, 50) == 3:
                    tmp_listelem[random.randint(0, len(tmp_listelem)) - 1] = random.randint(1, 4)

                newschedule.append(tmp_listelem)
            population = newschedule
            while len(population) < populationSize:
                population.append(
                    (ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0]))

        execution_time_end = timer()
        execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
        return rankedschedules[0][1], execution_time_ms

    @staticmethod
    def generate_population(start_date, end_date, metadata_body, size):
        population = []
        for _ in range(size):
            population.append(
                ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0])
        return population

    @staticmethod
    def eval_fitness(population, start_date, end_date, metadata_body):
        rankedschedules = []
        for s in population:
            rankedschedules.append((GeneticAlgorithm.fitness(s, start_date, end_date, metadata_body), s))
        rankedschedules.sort()
        return rankedschedules

    @staticmethod
    def fitness(schedule, start_date, end_date, data):
        delta = timedelta(days=1)
        employees = data['employees']
        vac_schedule = []
        for employee in employees:
            vac_schedule.append([string_to_date(date_) for date_ in employee['vacation_schedule']])
        for s in vac_schedule:
            for i in range(len(s)):
                s[i] = s[i].date()
        start__date = start_date.date()
        end__date = end_date.date()
        weekdays = []
        weekends = []
        holidays = []
        successive = 0
        holiday_list = get_austrian_holidays_dates(start__date, end__date)
        for _ in range(len(employees)):
            weekdays.append(0)
            weekends.append(0)
            holidays.append(0)
        counter = 0

        while start__date < end__date:
            day = start__date.weekday()
            if start__date in vac_schedule[schedule[counter] - 1]:  # program crashes with 2 employees if the
                return 10000  # stopping constraint isn't adjusted
            if day == 5 or day == 6:
                weekends[schedule[counter] - 1] += 1
            else:
                weekdays[schedule[counter] - 1] += 1
            if start__date in holiday_list:
                holidays[schedule[counter] - 1] += 1
            counter += 1
            start__date += delta
            if counter < len(schedule) - 1:
                if schedule[counter] == schedule[counter + 1]:
                    successive += 1

        mean_weekdays = np.mean(weekdays)
        mean_weekends = np.mean(weekends)
        mean_holidays = np.mean(holidays)
        deviation_weekdays = 0
        deviation_weekends = 0
        deviation_holidays = 0
        for s in zip(weekdays, weekends, holidays):
            deviation_weekdays += abs(mean_weekdays - s[0])
            deviation_weekends += abs(mean_weekends - s[1])
            deviation_holidays += abs(mean_holidays - s[2])
        return round(
            (deviation_weekdays * 10) + (deviation_weekends * 50) + (deviation_holidays * 100) + successive * 30, 2)
