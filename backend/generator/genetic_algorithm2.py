import random
from timeit import default_timer as timer
from .schedule_generator import ScheduleGenerator
from .genetic_algorithm import GeneticAlgorithm
import random

class Individual:
    def __init__(self, schedule, fitness):
        self.schedule = schedule
        self.fitness = fitness
    

class GeneticAlgorithm2:
    @staticmethod
    def genetic_algorithm(start_date, end_date, metadata_body):
        execution_time_start = timer()
        
        MAX_ITERATIONS = 10000
        POP_SIZE = 10
        MAX_ITER_SAME_BEST = 200

        random.seed(timer()) 
        population = GeneticAlgorithm2.generate_population(start_date, end_date, metadata_body, POP_SIZE)
        population = GeneticAlgorithm2.sort_population(population)
        previous_best = []
        previous_best.append(population[0].fitness)

        for gen in range(MAX_ITERATIONS):
            m_pool = GeneticAlgorithm2.mating_pool(population)

            new_population = GeneticAlgorithm2.combine_mutate(m_pool, start_date, end_date, metadata_body)
            # elitist -> also keep individuals of the old generation if they are better than the newly generated ones
            population += new_population
            population = GeneticAlgorithm2.sort_population(population)
            population = population[:POP_SIZE]
            if previous_best[-1] != population[0].fitness:
                previous_best = []
            previous_best.append(population[0].fitness)
            if len(previous_best) >= MAX_ITER_SAME_BEST:
                print(f'No improvement for {MAX_ITER_SAME_BEST} iterations. Stopping with generation {gen}')
                break

        execution_time_end = timer()
        execution_time_ms = round((execution_time_end - execution_time_start) * 1000, 2)
        return population[0].schedule, execution_time_ms, population[0].fitness

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
            i.pick_probability = 1-(i.fitness / sum_fitness)
        mating_pool = []
        while len(mating_pool) < len(population):
            mating_pool.append(GeneticAlgorithm2.select_individual(population))
        return mating_pool
    
    @staticmethod
    def select_individual(population):
       # roulette wheel selection
       r = random.random()
       for i in population:
            r -= i.pick_probability
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
