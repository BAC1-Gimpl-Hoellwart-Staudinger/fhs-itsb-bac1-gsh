from generator import generate_dataset, dump_dataset, generate_schedule
from datetime import date

if __name__ == "__main__":
    num_employees = 4
    start_date = date(2024, 1, 1)
    end_date = date(2024, 12, 31)
    min_vacation_days = 2
    max_vacation_days = 10

    dataset = generate_dataset(num_employees, start_date, end_date, min_vacation_days, max_vacation_days)
    dump_dataset(dataset)
    print("Successfully generated dataset.")

    generate_schedule(str(start_date), str(end_date))
