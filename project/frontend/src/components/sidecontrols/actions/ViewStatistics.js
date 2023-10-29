import { useContext } from 'react';
import { SideControlsContext } from '../../../contexts/SideControlsContext';
import { PiWarningDuotone } from 'react-icons/pi';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import ActionFormContainer from './ActionFormContainer';
import ActionButton from './ActionButton';
import useModal from '../../../hooks/useModal';

function ViewStatistics() {
    const { showModal, setShowModal, Modal } = useModal();
    const { stats } = useContext(SideControlsContext);

    function handleSubmit(event) {
        event.preventDefault();
        setShowModal(true);
    }

    function displayStats() {
        if(JSON.stringify(stats) === '{}' || !stats) {
            return (
                <div className="h-full flex flex-col gap-3 items-center justify-center">
                    <PiWarningDuotone size={52} />
                    <h2 className="text-2xl">No statistics available, generate a schedule first.</h2>
                </div>
            );
        } else {
            const scheduleLength = stats.stats.total_days;
            const employeeCount = stats.stats.total_employees;
            const employees = stats.metadata.employees;
            const daysWorkedPerEmployee = stats.stats.days_worked_per_employee;

            return (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-center gap-2">
                        <IoMdInformationCircleOutline size={18} />
                        <p className="text-gray-700 text-center">The statistics are based on the currently displaying calendar schedule</p> 
                    </div>
                    <div className="overflow-x-auto">
                        <p className="text-lg">Schedule length: <span className="font-semibold">{scheduleLength}</span> days</p>
                        <p className="text-lg">Schedule calculated for <span className="font-semibold">{employeeCount}</span> employees:</p>

                        <table className="border-collapse border table-auto mt-4 w-full">
                            <thead className="border text-center bg-gray-100">
                                <tr>
                                    <th className="py-3">Name</th> 
                                    <th className="py-3">Total days worked</th>
                                    <th className="py-3">Week days worked</th>
                                    <th className="py-3">Weekend days / Holidays worked</th>
                                </tr>
                            </thead>
                            <tbody className="border text-center">
                                {employees.map((employee, index) => (
                                    <tr
                                        key={index}
                                        className="border text-center"
                                    >
                                        <td className="py-3">{employee.name}</td>
                                        <td className="py-3">{daysWorkedPerEmployee[employee.id].sum}</td>
                                        <td className="py-3">{daysWorkedPerEmployee[employee.id].work_days}</td>
                                        <td className="py-3">{daysWorkedPerEmployee[employee.id].weekend_holiday_days}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }

    return (
        <ActionFormContainer
            onSubmit={handleSubmit}
        >
            <Modal
                label="View Statistics"
                showModal={showModal}
                setShowModal={setShowModal}
            >     
                {displayStats()}
            </Modal>

            <ActionButton
                type="submit"
                variant={3}
            >
                View Statistics
            </ActionButton>
        </ActionFormContainer>
    );
}

export default ViewStatistics;