import { useContext } from 'react';
import { CalendarContext } from '../../../contexts/CalendarContext';
import useAppointmentDialog from '../../../hooks/useAppointmentDialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppointmentDialogContainer from './AppointmentDialogContainer';
import AppointmentColors from './AppointmentColors';
import Appointment from '../../../utils/Appointment';

function EditDialog() {
    const {
        setAppointments,
        editAppointment,
        setShowEditDialog,
    } = useContext(CalendarContext);
    const {
        appointmentTitle,
        setAppointmentTitle,
        selectedColor,
        setSelectedColor,
        titleEmpty,
        setTitleEmpty,
        appointmentDate,
    } = useAppointmentDialog(editAppointment.title, editAppointment.color, { first: editAppointment.dateFrom, second: editAppointment.dateTo });

    function handleDeleteAppointment(event) {
        event.preventDefault();
        setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== editAppointment.id));
        setShowEditDialog(false);
    }

    function handleEditAppointment(event) {
        event.preventDefault();

        if(!appointmentTitle || appointmentTitle === '') {
            setTitleEmpty(true);
            return;
        }

        if(appointmentTitle === editAppointment.title && selectedColor === editAppointment.color) {
            setShowEditDialog(false);
            return;
        }

        const updatedAppointment = Appointment.createAppointment(
            appointmentTitle,
            editAppointment.dateFrom,
            editAppointment.dateTo,
            selectedColor
        );

        setAppointments((prevAppointments) => {
            const index = prevAppointments.findIndex((appointment) => appointment.id === editAppointment.id);
            const updatedAppointments = [...prevAppointments];
            updatedAppointments[index] = updatedAppointment;
            return updatedAppointments;
        });
        setShowEditDialog(false);
    }

    return (
        <AppointmentDialogContainer
            appointmentDate={appointmentDate}
            dialogType="EDIT"
            setShowDialog={setShowEditDialog}
        >
            <form onSubmit={handleEditAppointment}>
                <div className="flex flex-col gap-5 mt-3">
                    <TextField 
                        id="filled-edit"
                        variant="outlined"
                        onChange={(event) => setAppointmentTitle(event.target.value)}
                        value={appointmentTitle}
                        error={titleEmpty}
                    />

                    <AppointmentColors
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                    />

                    <Button
                        variant="contained"
                        type="button"
                        color="error"
                        onClick={handleDeleteAppointment}
                    >
                        Delete
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        color="warning"
                    >
                        Edit
                    </Button>
                </div>
            </form>
        </AppointmentDialogContainer>
    );
}

export default EditDialog;