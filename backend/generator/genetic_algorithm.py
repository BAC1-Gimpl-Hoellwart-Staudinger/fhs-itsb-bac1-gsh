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
        max_iterations = 15000

        random.seed(time.time())
        population = GeneticAlgorithm.generate_population(start_date, end_date, metadata_body, populationSize * 2)
        num_employees = len(metadata_body['employees'])

        for gen in range(max_iterations):
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
                return rankedschedules[0][1], execution_time_ms, rankedschedules[0][0]

            for s in rankedschedules:
                newschedule.append(s[1])

            while len(newschedule) < populationSize:
                newschedule.append(
                    (ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0]))

            for _ in range(int(populationSize * 0.5)):
                tmp_listelem = GeneticAlgorithm.crossover(newschedule, num_parents=4)
                if random.random() <= 0.1:
                    tmp_listelem[random.randint(0, len(tmp_listelem)) - 1] = random.randint(1, num_employees)
                newschedule.append(tmp_listelem)
            population = newschedule

        execution_time_end = timer()
        execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
        return rankedschedules[0][1], execution_time_ms, rankedschedules[0][0]

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
        datetime_day = timedelta(days=1)
        employees = data['employees']
        start_date = start_date.date()
        end_date = end_date.date()
        holiday_list = get_austrian_holidays_dates(start_date, end_date)

        vacation_schedule = []
        for employee in employees:
            vacation_schedule.append([string_to_date(date_).date() for date_ in employee['vacation_schedule']])

        weekdays = []
        weekends = []
        holidays = []
        successive = 0
        for _ in range(len(employees)):
            weekdays.append(0)
            weekends.append(0)
            holidays.append(0)

        num_employees = len(employees)
        i_day = 0
        suboptimal_interval = 0
        current_date = start_date
        while current_date < end_date:
            day = current_date.weekday()
            employee_index = schedule[i_day] - 1

            if current_date in vacation_schedule[employee_index]:
                return 1000000
            if day == 5 or day == 6:
                weekends[employee_index] += 1
            else:
                weekdays[employee_index] += 1
            if current_date in holiday_list:
                holidays[employee_index] += 1
                
            if current_date + timedelta(days=num_employees) < end_date:
                if schedule[i_day] != schedule[i_day + num_employees]:
                    suboptimal_interval += 1

            i_day += 1
            current_date += datetime_day
            if i_day < len(schedule) - 1:
                if schedule[i_day] == schedule[i_day + 1]:
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
            
        cost = ((deviation_weekdays * 10) +
                (deviation_weekends * 50) +
                (deviation_holidays * 100) +
                (successive * 30) +
                (suboptimal_interval * 40))
        return round(cost, 2)
