import { useContext, useState } from 'react';
import { SideControlsContext } from '../../../contexts/SideControlsContext';
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
    const { LOCAL_STORAGE_DATASETS_KEY, setDatasetSize } = useContext(SideControlsContext);
    const { isLoading, execute: getDatasetExecute } = useAsyncFn(getDataset);
    const [selectedDatePickerDateStart, setSelectedDatePickerDateStart] = useState(dayjs().startOf('month'));
    const [selectedDatePickerDateEnd, setSelectedDatePickerDateEnd] = useState(dayjs().endOf('month').add(1, 'year'));
    const [numberOfEmployees, setNumberOfEmployees] = useState(4);

    const minValueEmployees = 2;
    const maxValueEmployees = 10;
    const minMonths = 2;

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

        if(selectedDatePickerDateEnd.diff(selectedDatePickerDateStart, 'month') < minMonths) {
            toast.error(`Time difference between start and end date must be at least ${minMonths} months`);
            return;
        }

        toast.promise(
            getDatasetExecute(
                Date.formatAPIDate(selectedDatePickerDateStart),
                Date.formatAPIDate(selectedDatePickerDateEnd),
                numberOfEmployees
            ),
            {
                loading: 'Generating dataset...',
                success: (dataset) => {
                    const existingDatasets = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_DATASETS_KEY)) || [];
    
                    if(existingDatasets.length >= 5) {
                        existingDatasets.splice(0, existingDatasets.length);
                        setDatasetSize(0);
                        toast.error('Clearing datasets due to limit of 5', { duration: 3000, icon: '🗑️' });
                    }
    
                    const mergedDatasets = [...existingDatasets, dataset];
                    window.localStorage.setItem(LOCAL_STORAGE_DATASETS_KEY, JSON.stringify(mergedDatasets));
                    setDatasetSize(mergedDatasets.length);
    
                    return 'Successfully fetched dataset';
                },
                error: (err) => err,
            },
            {
                success: {
                    duration: 10_000,
                },
            }
        );
    }

    return (
        <ActionFormContainer
            onSubmit={handleSubmit}
        >
            <div className="flex flex-row justify-between md:gap-6 gap-4">
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

            <NumberPickerMUI
                label="Number of Employees"
                value={numberOfEmployees}
                setValue={setNumberOfEmployees}
                minValue={minValueEmployees}
                maxValue={maxValueEmployees}
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