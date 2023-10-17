from datetime import timedelta
from helper_functions import string_to_date
import numpy as np


class GeneticAlgorithm:
    @staticmethod
    def fitness(schedule, start_date, end_date, data):
        delta = timedelta(days=1)
        start__date = string_to_date(start_date)
        end__date = string_to_date(end_date)
        weekdays = []
        weekends = []

        for _ in range(len((data['employees']))):
            weekdays.append(0)
            weekends.append(0)
        counter = 0
        while start__date <= end__date:
            start__date += delta
            day = start__date.weekday()
            if day == 5 or day == 6:
                weekends[schedule[counter]-1] += 1
            else:
                weekdays[schedule[counter]-1] += 1
            counter += 1

        mean_weekdays = np.mean(weekdays)
        mean_weekends = np.mean(weekends)
        deviation_weekdays = 0
        deviation_weekends = 0
        for s in zip(weekdays, weekends):
            deviation_weekdays += abs(mean_weekdays - s[0])
            deviation_weekends += abs(mean_weekends - s[1])
        return (deviation_weekdays * 10) + (deviation_weekends * 50)
