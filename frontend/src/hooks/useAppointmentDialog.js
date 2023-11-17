import { useState } from 'react';
import Date from '../utils/Date';
import dayjs from 'dayjs';

function useAppointmentDialog(initalAppointmentTitle, initialSelectedColor, datesToFormat) {
    const [appointmentTitle, setAppointmentTitle] = useState(initalAppointmentTitle);
    const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
    const [titleEmpty, setTitleEmpty] = useState(false);
    const appointmentDate = (dayjs(datesToFormat.first).isSame(datesToFormat.second, 'day')) ? Date.formatDisplayDate(datesToFormat.first) : `${Date.formatDisplayDate(datesToFormat.first)} - ${Date.formatDisplayDate(datesToFormat.second)}`;

    return {
        appointmentTitle,
        setAppointmentTitle,
        selectedColor,
        setSelectedColor,
        titleEmpty,
        setTitleEmpty,
        appointmentDate,
    };
}

export default useAppointmentDialog;
