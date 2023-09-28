import React, { createContext, useState, useEffect } from 'react';
import Appointment from '../utils/Appointment';
import dayjs from 'dayjs';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    let initialAppointments = [];
    if (process.env.NODE_ENV !== 'production') {
        for(let i = 0; i < 4; i++) {
            initialAppointments.push(Appointment.generateAppointment());
        }
    }

    const [date, setDate] = useState(dayjs());
    const [viewScale, setViewScale] = useState('month');
    const [appointments, setAppointments] = useState(initialAppointments);
    const [dialogPosition, setInternalDialogPosition] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);
    const [viewAppointment, setViewAppointment] = useState(null);
    const DIALOG_WIDTH = 380;

    function setDialogPosition(event) {
        // check if dialog will be out of bounds
        if (event.clientX + DIALOG_WIDTH > window.innerWidth) {
            setInternalDialogPosition({
                x: event.clientX - DIALOG_WIDTH,
                y: event.clientY - 100,
            });
        } else {
            setInternalDialogPosition({
                x: event.clientX,
                y: event.clientY - 100,
            });
        }
    }
    
    function closeDialogs() {
        if(showViewDialog) setShowViewDialog(false);
        if(showCreateDialog) setShowCreateDialog(false);
        if(showEditDialog) setShowEditDialog(false);
    }

    useEffect(() => {
        appointments.sort((a, b) => {
            // order by amount of days
            const aSpan = dayjs(a.dateTo).diff(a.dateFrom, 'day');
            const bSpan = dayjs(b.dateTo).diff(b.dateFrom, 'day');
            return bSpan - aSpan;
        });
    }, [appointments]);

    return (
        <CalendarContext.Provider value={{
            date,
            viewScale,
            setViewScale,
            setDate,
            appointments,
            setAppointments,
            dialogPosition,
            setDialogPosition,
            selectedDate,
            setSelectedDate,
            showViewDialog,
            setShowViewDialog,
            showCreateDialog,
            setShowCreateDialog,
            showEditDialog,
            setShowEditDialog,
            closeDialogs,
            viewAppointment,
            setViewAppointment,
            editAppointment,
            setEditAppointment,
            DIALOG_WIDTH,
        }}>
            {children}
        </CalendarContext.Provider>
    );
}

export { CalendarContext, CalendarProvider };