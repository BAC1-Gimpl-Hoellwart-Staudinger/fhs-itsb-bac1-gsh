import dayjs from 'dayjs';

class Date {
    static getMonthMatrix(date) {
        const firstDayOfMonthDate = dayjs(date).startOf('month');
        // getDay() returns 0 - 6, where 0 is Sunday; we want 0 to be Monday
        const firstDayOfMonth = (dayjs(firstDayOfMonthDate).day() - 1) === -1 ? 6 : dayjs(firstDayOfMonthDate).day() - 1;
        const numberOfDaysInPrevMonth = dayjs(dayjs(date).subtract(1, 'month')).daysInMonth();
    
        let monthMatrix = new Array(5).fill([]);
        const firstMondayOfMatrix = numberOfDaysInPrevMonth - (firstDayOfMonth - 1);
        let currentDate = dayjs(date).startOf('day').subtract(1, 'month').date(firstMondayOfMatrix);
    
        monthMatrix.forEach((_, weekIndex) => {
            let weekArray = new Array(7).fill(null);
    
            weekArray.forEach((_, dayIndex) => {
                weekArray[dayIndex] = this.generateDateObject(currentDate);
                currentDate = dayjs(currentDate).add(1, 'day');
            });
    
            return monthMatrix[weekIndex] = weekArray;
        });
    
        return monthMatrix;
    }

    static getWeekArray(date) {
        const firstDayOfWeek = dayjs(date).startOf('week');
        const weekArray = new Array(7).fill(null);

        let currentDate = firstDayOfWeek;
        weekArray.forEach((_, dayIndex) => {
            weekArray[dayIndex] = this.generateDateObject(currentDate);
            currentDate = dayjs(currentDate).add(1, 'day');
        });

        return weekArray;
    }

    static generateDateObject(date) {
        return {
            date: date,
            day: date.get('date'),
            isToday: date.isSame(dayjs(), 'day')
        };
    }

    static formatDisplayDate(date) {
        if(date.hour() === 0 && date.minute() === 0) {
            return dayjs(date).format('DD.MM.YYYY');
        }
        return dayjs(date).format('DD.MM.YYYY HH:mm');
    }

    static formatAPIDate(date) {
        return dayjs(date).format('YYYY-MM-DD');
    }

    static isMonday(date) {
        return dayjs(date).day() === 1;
    }

    static weekDaysShort() {
        return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    }

    static dayTimes() {
        let dayTimes = ['all-day'];
        for(let t = 0; t < 24; ++t) {
            dayTimes.push(`${t}:00`);
        }
        return dayTimes;
    }
}

export default Date;