import { useContext } from 'react';
import { CalendarContext } from '../contexts/CalendarContext';
import AppointmentUtil from '../utils/Appointment';
import Date from '../utils/Date';
import dayjs from 'dayjs';

function Appointment(props) {
    const { appointment, day } = props;
    const { viewScale, setViewAppointment, setShowViewDialog, closeDialogs, setDialogPosition } = useContext(CalendarContext);

    function handleViewClick(event, appointment) {
        closeDialogs();
        event.stopPropagation();
        setViewAppointment({ ...appointment }); // do not pass by reference
        setDialogPosition(event);
        setShowViewDialog(true);
    }

    function generateAppointmentStyle(appointment) {
        let style = `z-40 h-7 p-1 text-sm font-semibold px-2 relative text-ellipsis whitespace-nowrap align-middle flex items-center`;
        
        if(AppointmentUtil.isAllDay(appointment)) {
            style += ` ${appointment.color} text-white`;
        } else {
            style += ` border-2 ${appointment.borderColor} bg-white text-black`;
        }

        if(dayjs(appointment.dateFrom).isSame(appointment.dateTo, 'day')) {
            style += ' rounded-md';
        } else if(dayjs(day.date).isSame(appointment.dateFrom, 'day')) {
            style += ' rounded-l-md';
        } else if(dayjs(day.date).isSame(appointment.dateTo, 'day')) {
            style += ' rounded-r-md';
        }
        return style;
    }

    function generateSpaceFillerStyle(appointment) {
        let style = 'absolute left-[-10px] w-[15px] h-7';

        if(AppointmentUtil.isAllDay(appointment)) {
            style += ` ${appointment.color} top-0`;
        } else {
            style += ` border-x-0 border-y-2 ${appointment.borderColor} bg-white top-[-2px]`;
        }

        return style;
    }

    return (
        <div
            className={generateAppointmentStyle(appointment)}
            onClick={(event) => handleViewClick(event, appointment)}
        >
            {(dayjs(day.date).isSame(appointment.dateFrom, 'day') || viewScale === 'day') ? (
                appointment.title
            ) : (!Date.isMonday(day.date) && viewScale !== 'day') && (
                <div className={generateSpaceFillerStyle(appointment)} />
            )}
        </div>
    );
}

export default Appointment;