import { useContext, useState, useEffect } from 'react';
import { CalendarContext } from '../../../contexts/CalendarContext';
import useAppointmentDialog from '../../../hooks/useAppointmentDialog';
import AppointmentDialogContainer from './AppointmentDialogContainer';
import AppointmentColors from './AppointmentColors';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePickerMUI from '../../inputs/DatePickerMUI';
import TimePickerMUI from '../../inputs/TimePickerMUI';
import Appointment from '../../../utils/Appointment';
import { Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

function CreateDialog() {
    const {
        selectedDate,
        setAppointments,
        setShowCreateDialog,
    } = useContext(CalendarContext);
    const [selectedDatePickerDateStart, setSelectedDatePickerDateStart] = useState(selectedDate);
    const [selectedDatePickerDateEnd, setSelectedDatePickerDateEnd] = useState(selectedDate);
    const [selectedTimePickerTimeStart, setSelectedTimePickerTimeStart] = useState(dayjs().hour(0).minute(0).second(0).millisecond(0));
    const [selectedTimePickerTimeEnd, setSelectedTimePickerTimeEnd] = useState(dayjs().hour(0).minute(0).second(0).millisecond(0));
    const [allDay, setAllDay] = useState(true);
    const {
        appointmentTitle,
        setAppointmentTitle,
        selectedColor,
        setSelectedColor,
        titleEmpty,
        setTitleEmpty,
        appointmentDate,
    } = useAppointmentDialog('', 'bg-blue-600', { first: selectedDatePickerDateStart, second: selectedDatePickerDateEnd });

    function handleCreateAppointment(event) {
        event.preventDefault();

        if(!appointmentTitle || appointmentTitle === '') {
            setTitleEmpty(true);
            return;
        }

        if(selectedDatePickerDateStart.isAfter(selectedDatePickerDateEnd)) {
            toast.error('Start date must be before end date');
            return;
        }
        
        if(selectedTimePickerTimeStart.isAfter(selectedTimePickerTimeEnd)) {
            toast.error('Start time must be before end time');
            return;
        }

        let dateFrom = selectedDatePickerDateStart.clone();
        let dateTo = selectedDatePickerDateEnd.clone();

        if (!allDay) {
            dateFrom = dateFrom.hour(selectedTimePickerTimeStart.hour()).minute(selectedTimePickerTimeStart.minute());
            dateTo = dateTo.hour(selectedTimePickerTimeEnd.hour()).minute(selectedTimePickerTimeEnd.minute());
        } else {
            dateFrom = dateFrom.startOf('day');
            dateTo = dateTo.startOf('day');
        }

        const newAppointment = Appointment.createAppointment(appointmentTitle, dateFrom, dateTo, selectedColor);
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);

        setShowCreateDialog(false);
    }

    useEffect(() => {
        setSelectedDatePickerDateStart(selectedDate);
        setSelectedDatePickerDateEnd(selectedDate);
    }, [selectedDate]);

    return (
        <AppointmentDialogContainer
            appointmentDate={appointmentDate}
            dialogType="CREATE"
            setShowDialog={setShowCreateDialog}
        >
            <form onSubmit={handleCreateAppointment}>
                <div className="flex flex-col gap-5 mt-3">
                    <TextField 
                        id="filled-create"
                        label="Appointment Title"
                        variant="filled"
                        onChange={(event) => setAppointmentTitle(event.target.value)}
                        error={titleEmpty}
                    />
                    
                    <div className="flex gap-3">
                        <DatePickerMUI
                            label="Start Date"
                            selectedDatePickerDate={selectedDatePickerDateStart}
                            setSelectedDatePickerDate={setSelectedDatePickerDateStart}
                        />
                        <DatePickerMUI
                            label="End Date"
                            selectedDatePickerDate={selectedDatePickerDateEnd}
                            setSelectedDatePickerDate={setSelectedDatePickerDateEnd}
                        />
                    </div>

                    <AppointmentColors
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                    />

                    <div className="flex flex-col items-center">
                        <div className="flex gap-3">
                            <TimePickerMUI
                                label="Start Time"
                                selectedTimePickerTime={selectedTimePickerTimeStart}
                                setSelectedTimePickerTime={setSelectedTimePickerTimeStart}
                                disabled={allDay}
                            />
                            <TimePickerMUI
                                label="End Time"
                                selectedTimePickerTime={selectedTimePickerTimeEnd}
                                setSelectedTimePickerTime={setSelectedTimePickerTimeEnd}
                                disabled={allDay}
                            />
                        </div>
                        <FormControlLabel
                            control={
                            <Checkbox
                                defaultChecked
                                onChange={() => setAllDay((prevAllDay) => !prevAllDay)}
                            />}
                            label="all-day"
                        />
                    </div>

                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Create
                    </Button>
                </div>
            </form>
        </AppointmentDialogContainer>
    );
}

export default CreateDialog;