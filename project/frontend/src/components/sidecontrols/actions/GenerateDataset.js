import { useState } from 'react';
import DatePickerMUI from '../../inputs/DatePickerMUI';
import ActionFormContainer from './ActionFormContainer';
import NumberPickerMUI from '../../inputs/NumberPickerMUI';
import ActionSubmitButtion from './ActionSubmitButton';
import { useAsyncFn } from '../../../hooks/useAsync';
import { getDataset } from '../../../utils/ApiRequest';
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

        getDatasetExecute(selectedDatePickerDateStart, selectedDatePickerDateEnd, numberOfEmployees)
            .then((data) => console.log(data))
            .catch((err) => toast.error(err));
    }

    return (
        <ActionFormContainer
            handleSubmit={handleSubmit}
        >
            <div className="flex flex-row justify-between gap-10">
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

            <ActionSubmitButtion
                isLoading={isLoading}
                variant={0}
            >
                Generate Dataset
            </ActionSubmitButtion>
        </ActionFormContainer>
    );
}

export default GenerateDataset;