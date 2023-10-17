from employee_generator import EmployeeGenerator
from schedule_generator import ScheduleGenerator
from datetime import date, datetime

if __name__ == "__main__":
    now = datetime.now()
    num_employees = 4
    start_date = date(2024, 1, 1)
    end_date = date(2024, 12, 31)
    min_vacation_days = 2
    max_vacation_days = 10

    dataset = EmployeeGenerator.generate(num_employees, start_date, end_date, min_vacation_days, max_vacation_days)
    EmployeeGenerator.dump_json(dataset=dataset)

    schedule = []   # for testing --> creating 1000 schedules takes approximately 300 ms
    for i in range(1000):
        schedule.append(ScheduleGenerator.generate(start_date=str(start_date), end_date=str(end_date), dataset=dataset))

    now1 = datetime.now()
    print(now1-now)
    print(len(schedule))
