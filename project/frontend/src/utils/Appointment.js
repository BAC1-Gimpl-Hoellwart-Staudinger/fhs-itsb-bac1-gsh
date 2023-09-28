import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

class Appointment {
    static colors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600'];
    static borderColors = ['border-blue-600', 'border-green-600', 'border-yellow-600', 'border-red-600', 'border-indigo-600', 'border-purple-600', 'border-pink-600'];

    static createAppointment(title, dateFrom, dateTo, color) {
        return {
            id: uuidv4(),
            title: title,
            dateFrom: dateFrom,
            dateTo: dateTo,
            color: color,
            borderColor: this.borderColors[this.colors.indexOf(color)],
        };
    }

    static generateAppointment() {
        const chanceOneInFour = Math.floor(Math.random() * 4) === 0;

        const title = `Appointment ${Math.floor(Math.random() * 100)}`;
        let dateFrom = '', dateTo = '';
        if(chanceOneInFour) {
            dateFrom = dayjs().month(dayjs().month()).startOf('month').add(Math.floor(Math.random() * 30), 'day').hour(Math.floor(Math.random() * 24)).minute(Math.floor(Math.random() * 60));
            dateTo = dayjs(dateFrom).add(Math.floor(Math.random() * 5), 'day').hour(Math.floor(Math.random() * 24)).minute(Math.floor(Math.random() * 60));
        } else {
            dateFrom = dayjs().month(dayjs().month()).startOf('month').add(Math.floor(Math.random() * 30), 'day').startOf('day');
            dateTo = dayjs(dateFrom).add(Math.floor(Math.random() * 5), 'day').startOf('day');
        }
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        return Appointment.createAppointment(title, dateFrom, dateTo, color);
    }

    static isAllDay(appointment) {
        return (
            dayjs(appointment.dateFrom).hour() === 0 &&
            dayjs(appointment.dateFrom).minute() === 0 &&
            dayjs(appointment.dateTo).hour() === 0 &&
            dayjs(appointment.dateTo).minute() === 0
        );
    }
}

export default Appointment;