from datetime import timedelta, date
from .helper_functions import string_to_date, get_austrian_holidays_dates
import numpy as np
import random
from timeit import default_timer as timer
from .schedule_generator import ScheduleGenerator
import pandas as pd
import random

class Individual:
    def __init__(self, schedule, fitness):
        self.schedule = schedule
        self.fitness = fitness
    

class GeneticAlgorithm:
    @staticmethod
    def genetic_algorithm(start_date, end_date, metadata_body):
        execution_time_start = timer()
        
        MAX_ITERATIONS = 10000
        POP_SIZE = 10
        MAX_ITER_SAME_BEST = 200

        random.seed(timer()) 
        num_employees = len(metadata_body['employees'])
        population = GeneticAlgorithm.generate_population(start_date, end_date, metadata_body, POP_SIZE)
        population = GeneticAlgorithm.sort_population(population)
        previous_best = []
        previous_best.append(population[0].fitness)

        for gen in range(MAX_ITERATIONS):
            m_pool = GeneticAlgorithm.mating_pool(population)

            new_population = GeneticAlgorithm.combine_mutate(m_pool, start_date, end_date, metadata_body)
            # elitist -> also keep individual of the old generation if they are better -> chance for local minima
            # if we dont want an elitist apporach combine_mutate needs to be changed to produce len(population) new individuals
            # not not len(population) // 2
            population += new_population
            population = GeneticAlgorithm.sort_population(population)
            population = population[:POP_SIZE]
            if previous_best[-1] != population[0].fitness:
                previous_best = []
            previous_best.append(population[0].fitness)
            if len(previous_best) >= MAX_ITER_SAME_BEST:
                print(f'No improvement for {MAX_ITER_SAME_BEST} iterations. Stopping with generation {gen}')
                break

        execution_time_end = timer()
        execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
        return population[0].schedule, execution_time_ms

    @staticmethod
    def generate_population(start_date, end_date, metadata_body, size):
        population = []
        for _ in range(size):
            schedule = ScheduleGenerator.generate_sample_schedule(start_date, end_date, metadata_body['employees'])[0]
            population.append(Individual(schedule, GeneticAlgorithm.fitness(schedule, start_date, end_date, metadata_body)))
        return population
    
    @staticmethod
    def sort_population(population):
        population.sort(key=lambda i: i.fitness)
        return population
    
    @staticmethod
    def mating_pool(population):
        sum_fitness = 0
        for i in population:
            sum_fitness += i.fitness
        for i in population:
            i.relative_fitness = i.fitness / sum_fitness
        mating_pool = []
        while len(mating_pool) < len(population):
            mating_pool.append(GeneticAlgorithm.select_individual(population))
        return mating_pool
    
    @staticmethod
    def select_individual(population):
       # roulette wheel selection
       r = random.random()
       for i in population:
            r -= i.relative_fitness
            if r <= 0:
                return i
            
    @staticmethod
    def combine_mutate(mating_pool, start_date, end_date, metadata_body):
        num_employees = len(metadata_body['employees'])

        # one point crossover based on relative fitness
        if len(mating_pool) % 2:
            mating_pool.pop()
        parent1 = mating_pool[:len(mating_pool)//2]
        parent2 = mating_pool[len(mating_pool)//2:]

        new_population = []
        for i in range(len(parent1)):
            crossover_point = parent1[i].fitness / (parent1[i].fitness + parent2[i].fitness)
            crossover_point = int(crossover_point * len(parent1[i].schedule))
            new_schedule = parent1[i].schedule[:crossover_point] + parent2[i].schedule[crossover_point:]
            # mutatate one day with 1% probability
            for i in range(len(new_schedule)):
                if random.random() < 0.01:
                    new_schedule[i] = random.randint(1, num_employees)
            new_population.append(Individual(new_schedule, GeneticAlgorithm.fitness(new_schedule, start_date, end_date, metadata_body)))
        return new_population



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
        holiday_list = get_austrian_holidays_dates(start__date, end__date)
        for _ in range(len(employees)):
            weekdays.append(0)
            weekends.append(0)
            holidays.append(0)
        counter = 0

        while start__date < end__date:
            day = start__date.weekday()
            if start__date in vac_schedule[schedule[counter] - 1]:
                return 10000
            if day == 5 or day == 6:
                weekends[schedule[counter] - 1] += 1
            else:
                weekdays[schedule[counter] - 1] += 1
            if start__date in holiday_list:
                holidays[schedule[counter] - 1] += 1
            counter += 1
            start__date += delta

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
        return round((deviation_weekdays * 10) + (deviation_weekends * 50) + (deviation_holidays * 100), 2)
