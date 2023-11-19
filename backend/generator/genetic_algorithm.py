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

        execution_time_start = timer()
        rankedschedules = []

        populationSize = 50
        bestsolution = [1000000, 0]
        stopping_condition = 500

        random.seed(time.time())
        population = GeneticAlgorithm.generate_population(start_date, end_date, metadata_body, populationSize * 2)
        num_employees = len(metadata_body['employees'])

        for gen in range(5000):
            rankedschedules = GeneticAlgorithm.eval_fitness(population, start_date, end_date, metadata_body)
            rankedschedules = rankedschedules[:populationSize]
            newschedule = []

            if gen % 500 == 0:
                print(f'Population Size: {len(rankedschedules)} Best Solution Gen ({gen}): {rankedschedules[0][0]}')

            if rankedschedules[0][0] < bestsolution[0]:
                bestsolution[0] = rankedschedules[0][0]
                bestsolution[1] = gen

            if gen - bestsolution[1] > stopping_condition:
                execution_time_end = timer()
                execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
                print(f'Population Size: {len(rankedschedules)} Best Solution Gen ({gen}): {rankedschedules[0][0]}')
                return rankedschedules[0][1], execution_time_ms

            for s in rankedschedules:
                newschedule.append(s[1])

            while len(newschedule) < populationSize:
                newschedule.append(
                    (ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0]))

            for _ in range(int(populationSize * 0.5)):
                tmp_listelem = GeneticAlgorithm.crossover(newschedule, 4)
                if random.random() <= 0.1:
                    tmp_listelem[random.randint(0, len(tmp_listelem)) - 1] = random.randint(1, num_employees)
                newschedule.append(tmp_listelem)
            population = newschedule

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
    def crossover(schedule, num_parents):
        len_sched = len(schedule[0])
        divisor = True
        if len_sched % num_parents != 0:
            divisor = False
        new_elem = []
        size_of_elem = int(len_sched / num_parents)
        parents = random.sample(schedule, num_parents)

        for i in range(num_parents):
            tmp_elem = parents[i]
            if not divisor and i == num_parents - 1:
                index = size_of_elem * i
                new_elem += tmp_elem[index:index + (len_sched - len(new_elem))]
                break
            index = size_of_elem * i
            new_elem += tmp_elem[index:index + size_of_elem]
        return new_elem

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

            if start__date in vac_schedule[schedule[counter] - 1]:
                return 1000000
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