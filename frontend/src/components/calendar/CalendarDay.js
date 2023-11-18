import { useState, useEffect, useContext } from 'react';
import { CalendarContext } from '../../contexts/CalendarContext';
import Appointment from './Appointment';
import dayjs from 'dayjs';

function CalendarDay(props) {
    const {
        appointments,
        holidaysAT,
        setSelectedDate,
        setShowCreateDialog,
        closeDialogs,
        setDialogPosition
    } = useContext(CalendarContext);
    const { day } = props;

    const [allAppointments, setAllAppointments] = useState([]);

    function handleDayClick(event, date) {
        closeDialogs();
        setSelectedDate(date);
        setDialogPosition(event);
        setShowCreateDialog(true);
    }

    useEffect(() => {
        setAllAppointments([...appointments, ...holidaysAT]);
    }, [appointments, holidaysAT]);

    return (
        <div
            className="border border-gray-300 grid grid-cols-1 grid-rows-[2fr,6fr] cursor-pointer z-10 h-full"
            onClick={(event) => handleDayClick(event, day.date)}
        >
            <header className="flex justify-center items-center">
                <div className="text-sm">
                    <span className={day.isToday ? `bg-blue-600 rounded-full p-1.5 text-white` : ''}>{day.day}</span>
                </div>
            </header>
            <div className='pt-1'>
                {allAppointments.map((appointment, appointmentIndex) => (
                    dayjs(day.date).isBetween(appointment.dateFrom, appointment.dateTo, 'day', '[]') && (
                        <Appointment
                            key={appointmentIndex}
                            appointment={appointment}
                            day={day}
                        />
                    )
                ))}
            </div>
        </div>
    );
}

export default CalendarDay;