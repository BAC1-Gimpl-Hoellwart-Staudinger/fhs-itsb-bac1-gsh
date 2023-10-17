from employee_generator import EmployeeGenerator
from schedule_generator import ScheduleGenerator
from datetime import date

if __name__ == "__main__":
    num_employees = 4
    start_date = date(2024, 1, 1)
    end_date = date(2024, 12, 31)
    min_vacation_days = 2
    max_vacation_days = 10

    dataset = EmployeeGenerator.generate(num_employees, start_date, end_date, min_vacation_days, max_vacation_days)
    EmployeeGenerator.dump_json(dataset=dataset)

    ScheduleGenerator.generate(start_date=str(start_date), end_date=str(end_date))
