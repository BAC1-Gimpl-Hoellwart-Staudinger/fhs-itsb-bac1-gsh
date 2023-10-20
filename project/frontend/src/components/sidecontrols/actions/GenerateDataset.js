import { useState } from 'react';
import { useAsyncFn } from '../../../hooks/useAsync';
import { getDataset } from '../../../utils/ApiRequest';
import Date from '../../../utils/Date';
import DatePickerMUI from '../../inputs/DatePickerMUI';
import ActionFormContainer from './ActionFormContainer';
import NumberPickerMUI from '../../inputs/NumberPickerMUI';
import ActionButton from './ActionButton';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

function GenerateDataset() {
    const { isLoading, execute: getDatasetExecute } = useAsyncFn(getDataset);
    const [selectedDatePickerDateStart, setSelectedDatePickerDateStart] = useState(dayjs().startOf('month'));
    const [selectedDatePickerDateEnd, setSelectedDatePickerDateEnd] = useState(dayjs().endOf('month').add(1, 'year'));
    const [numberOfEmployees, setNumberOfEmployees] = useState(4);

    const minValueEmployees = 2;
    const maxValueEmployees = 10;

    function handleSubmit(event) {
        event.preventDefault();
        
        if(numberOfEmployees > maxValueEmployees || numberOfEmployees < minValueEmployees) {
            toast.error(`Number of employees must be between ${minValueEmployees} and ${maxValueEmployees}`);
            return;
        }

        if(selectedDatePickerDateStart.isAfter(selectedDatePickerDateEnd)) {
            toast.error('Start date must be before end date');
            return;
        }

        getDatasetExecute(
            Date.formatAPIDate(selectedDatePickerDateStart),
            Date.formatAPIDate(selectedDatePickerDateEnd),
            numberOfEmployees
        )
            .then((dataset) => {
                const existingAppointments = JSON.parse(window.localStorage.getItem('appointments')) || [];

                if(existingAppointments.length > 5) {
                    existingAppointments.splice(0, existingAppointments.length);
                }

                const mergedAppointments = [...existingAppointments, dataset];
                window.localStorage.setItem('appointments', JSON.stringify(mergedAppointments));

                toast.success('Successfully fetched dataset', { duration: 3000 });
            })
            .catch((err) => toast.error(err));
    }

    return (
        <ActionFormContainer
            handleSubmit={handleSubmit}
        >
            <div className="flex flex-row justify-between md:gap-10 gap-5">
                <DatePickerMUI
                    label="Start Date"
                    selectedDatePickerDate={selectedDatePickerDateStart}
                    setSelectedDatePickerDate={setSelectedDatePickerDateStart}
                    textFieldSize="small"
                />

                <DatePickerMUI
                    label="End Date"
                    selectedDatePickerDate={selectedDatePickerDateEnd}
                    setSelectedDatePickerDate={setSelectedDatePickerDateEnd}
                    textFieldSize="small"
                />
            </div>

            <NumberPickerMUI
                label="Number of Employees"
                value={numberOfEmployees}
                setValue={setNumberOfEmployees}
                minValue={minValueEmployees}
                maxValue={maxValueEmployees}
                size="small"
            />

            <ActionButton
                isLoading={isLoading}
                type="submit"
                variant={0}
            >
                Generate Dataset
            </ActionButton>
        </ActionFormContainer>
    );
}

export default GenerateDataset;