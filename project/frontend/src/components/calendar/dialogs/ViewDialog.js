import { useContext } from 'react';
import { CalendarContext } from '../../../contexts/CalendarContext';
import AppointmentDialogContainer from './AppointmentDialogContainer';
import Appointment from '../../../utils/Appointment';
import Date from '../../../utils/Date';

function ViewDialog() {
    const {
        setShowViewDialog,
        viewAppointment,
    } = useContext(CalendarContext);

    function generateTitleStyle(appointment) {
        let style = '';

        if(Appointment.isAllDay(appointment)) {
            style += `${appointment.color} text-white`;
        } else {
            style += `border-2 ${appointment.borderColor} bg-white text-black`;
        }

        return style;
    }

    return (
        <AppointmentDialogContainer
            dialogType="VIEW"
            viewAppointment={viewAppointment}
            setShowDialog={setShowViewDialog}
        >
            <div className="flex flex-col gap-1 mt-3">
            <h4 className="mb-3">
                <span className={`font-semibold py-1 px-3 rounded-md ${generateTitleStyle(viewAppointment)}`}>
                    Title: <span className="font-normal">{viewAppointment.title}</span>
                </span>
            </h4>
                <p className="ps-4">&ndash; <span className="font-semibold">From:</span> {Date.formatDisplayDate(viewAppointment.dateFrom)}</p>
                <p className="ps-4">&ndash; <span className="font-semibold">To:</span> {Date.formatDisplayDate(viewAppointment.dateTo)}</p>
            </div>
        </AppointmentDialogContainer>
    );
}

export default ViewDialog;