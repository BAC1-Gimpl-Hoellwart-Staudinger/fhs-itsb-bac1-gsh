import React, { createContext, useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    let initialAppointments = [];
    /*if (process.env.NODE_ENV !== 'production') {
        for(let i = 0; i < 4; i++) {
            initialAppointments.push(Appointment.generateAppointment());
        }
    }*/

    const VIEW_SCALES = {
        day: 'DAY',
        week: 'WEEK',
        month: 'MONTH',
    };

    const [date, setDate] = useState(dayjs());
    const [viewScale, setViewScale] = useState(VIEW_SCALES.month);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [dialogPosition, setInternalDialogPosition] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);
    const [viewAppointment, setViewAppointment] = useState(null);
    const [internalEventClick, setInternalEventClick] = useState(undefined);
    const [dialogHeight, setDialogHeight] = useState(undefined);
    const DIALOG_WIDTH = 380;

    const setDialogPosition = useCallback((event) => {
        // dialogHeight will be undefined in first run, if dialog will exceed the window height
        // we need need to rerun this function after the dialog is rendered and its height is computed (see useEffect below)
        setInternalEventClick(event);

        // check if dialog will be out of bounds
        if (event.clientX + DIALOG_WIDTH > window.innerWidth && event.clientY + dialogHeight > window.innerHeight) {
            setInternalDialogPosition({
                x: event.clientX - DIALOG_WIDTH,
                y: event.clientY - dialogHeight,
            });
        } else if(event.clientX + DIALOG_WIDTH > window.innerWidth) {
            setInternalDialogPosition({
                x: event.clientX - DIALOG_WIDTH,
                y: event.clientY,
            });
        } else if(event.clientY + dialogHeight > window.innerHeight) {
            setInternalDialogPosition({
                x: event.clientX,
                y: event.clientY - dialogHeight,
            });
        } else {
            setInternalDialogPosition({
                x: event.clientX,
                y: event.clientY,
            });
        }
    }, [dialogHeight]);
    
    useEffect(() => {
        if (internalEventClick && dialogHeight) {
            setDialogPosition(internalEventClick);
        }
    }, [dialogHeight, internalEventClick, setDialogPosition]);

    const closeDialogs = useCallback(() => {
        if(showViewDialog) setShowViewDialog(false);
        if(showCreateDialog) setShowCreateDialog(false);
        if(showEditDialog) setShowEditDialog(false);
    }, [showViewDialog, showCreateDialog, showEditDialog]);

    useEffect(() => {
        function handleResize() {
            closeDialogs();
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [closeDialogs]);

    /*
     * This useEffect is only necessary, if appointments can be longer than one day.
     * As this is not required in our use case, we can comment it out due to performance reasons.
     *
    useEffect(() => {
        appointments.sort((a, b) => {
            // order by amount of days
            const aSpan = dayjs(a.dateTo).diff(a.dateFrom, 'day');
            const bSpan = dayjs(b.dateTo).diff(b.dateFrom, 'day');
            return bSpan - aSpan;
        });
    }, [appointments]);*/

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
            dialogHeight,
            setDialogHeight,
            VIEW_SCALES,
        }}>
            {children}
        </CalendarContext.Provider>
    );
}

export { CalendarContext, CalendarProvider };