import { useContext, useRef, useEffect } from 'react';
import { CalendarContext } from '../../../contexts/CalendarContext';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { GrFormClose } from 'react-icons/gr';

function AppointmentDialogContainer(props) {
    const {
        setAppointments,
        setEditAppointment,
        dialogPosition,
        setDialogPosition,
        setShowEditDialog,
        DIALOG_WIDTH,
        setDialogHeight,
    } = useContext(CalendarContext);
    const {
        children,
        appointmentDate = null,
        viewAppointment = null,
        dialogType,
        setShowDialog
    } = props;
    const dialogRef = useRef(null);
    const iconButtonClasses = 'p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 ease-in-out';

    useEffect(() => {
        if (dialogRef.current) {
            setDialogHeight(dialogRef.current.clientHeight);
        }
    }, [children, setDialogHeight]);

    function handleBackdropClick(event) {
        // close the dialog only if the user clicks on the backdrop
        if (event.target === event.currentTarget) {
            setShowDialog(false);
        }
    }

    function handleEditClick(event, appointment) {
        setShowDialog(false);
        setEditAppointment({ ...appointment }); // do not pass by reference
        setDialogPosition(event);
        setShowEditDialog(true);
    }

    function handleDeleteClick(event, viewAppointment) {
        event.preventDefault();
        setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== viewAppointment.id));
        setShowDialog(false);
    }

    return (
        <div 
            className="h-screen w-full absolute top-0 left-0"
            onClick={handleBackdropClick}
        >
            <div
                className="fixed bg-white border border-gray-300 p-4 rounded-md shadow-md z-50"
                style={{ left: `${dialogPosition.x}px`, top: `${dialogPosition.y}px`, width: `${DIALOG_WIDTH}px` }}
                ref={dialogRef}
            >
                <div className="flex flex-row justify-between items-center">
                    <p>
                        {<span className="font-bold">[{dialogType}]</span>} {appointmentDate && <span className="font-semibold">{appointmentDate}</span>}
                    </p>
                    <div className="flex flex-row gap-3">
                        {dialogType === 'VIEW' && (
                            <>
                                <button
                                    className={iconButtonClasses}
                                    onClick={(event) => handleEditClick(event, viewAppointment)}
                                >
                                    <MdEdit size={18} />
                                </button>
                                <button
                                    className={iconButtonClasses}
                                    onClick={(event) => handleDeleteClick(event, viewAppointment)}
                                >
                                    <MdDeleteForever size={18} />
                                </button>
                            </>
                        )}
                        <button
                            className={iconButtonClasses}
                            onClick={() => setShowDialog(false)}
                        >
                            <GrFormClose size={18} />
                        </button>
                    </div>
                </div>
                    {children}
            </div>
        </div>
    );
}

export default AppointmentDialogContainer;