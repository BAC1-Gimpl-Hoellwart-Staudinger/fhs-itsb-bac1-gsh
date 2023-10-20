import { useContext } from 'react';
import { CalendarContext } from '../../contexts/CalendarContext';
import Date from '../../utils/Date';
import CalendarDay from './CalendarDay';
import ViewDialog from './dialogs/ViewDialog';
import CreateDialog from './dialogs/CreateDialog';
import EditDialog from './dialogs/EditDialog';

function Calendar() {
    const {
        date,
        selectedDate,
        viewScale,
        showViewDialog,
        showCreateDialog,
        viewAppointment,
        editAppointment,
        showEditDialog,
        VIEW_SCALES,
    } = useContext(CalendarContext);
    const topBarStyle = 'flex justify-center items-center border border-gray-300 py-2';

    let monthMatrix = null, weekArray = null, day = null;
    if(viewScale === VIEW_SCALES.month) {
        monthMatrix = Date.getMonthMatrix(date);
    } else if(viewScale === VIEW_SCALES.week) {
        weekArray = Date.getWeekArray(date);
    } else {
        day = Date.generateDateObject(date);
    }

    return (
        <div className="flex flex-col">
        {/*<div className={`${viewScale === 'month' ? 'flex flex-col' : 'grid grid-cols-[1fr,7fr] grid-rows-[auto,1fr]'}`}>*/}
            {viewScale === VIEW_SCALES.day ? (
                <div>
                    <span className={topBarStyle}>
                        {Date.weekDaysShort()[date.day()]}, {Date.formatDisplayDate(date.startOf('day'))}
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-7">
                {/*<div className={`grid grid-cols-7 ${viewScale === VIEW_SCALES.week ? 'col-start-2' : ''}`}>*/}
                    {Date.weekDaysShort().map((day, dayIndex) => (
                        <span
                            key={dayIndex}
                            className={topBarStyle}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            )}
            
            {viewScale === VIEW_SCALES.month && (
                <div className="h-full grid grid-rows-[1fr,1fr,1fr,1fr,1fr]">
                    {monthMatrix.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            className="grid grid-cols-7"
                        >
                            {week.map((day, dayIndex) => {
                                return (<CalendarDay
                                    key={dayIndex}
                                    day={day}
                                />)
                            })}
                        </div>
                    ))}
                </div>
            )}

            {viewScale === VIEW_SCALES.week && (
                <>
                {/*
                    THE FOLLOWING CODE IS THE BEGINNING FOR TIME SLOTS
                

                    <div className={`col-start-1 col-end-2 row-start-1 row-end-2 ${topBarStyle}`}>
                        <AiOutlineFieldTime size={20} />
                    </div>
                    <div className="col-start-1 grid grid-rows-26">
                    {Date.dayTimes().map((time, timeIndex) => (
                        <span
                            key={timeIndex}
                            className="flex justify-center items-center border border-gray-300 py-2"
                        >
                            {time}
                        </span>
                    ))}
                    </div>*/}
                    <div className="col-start-2 grid grid-cols-7 flex-grow">
                        {weekArray.map((day, dayIndex) => {
                            return (<CalendarDay
                                key={dayIndex}
                                day={day}
                            />)
                        })}
                    </div>
                </>
            )}

            {viewScale === VIEW_SCALES.day && (
                <div className="flex-grow">
                    <CalendarDay
                        day={day}
                    />
                </div>
            )}

            {showViewDialog && viewAppointment && (
                <ViewDialog />
            )}

            {showCreateDialog && selectedDate && (
                <CreateDialog />
            )}

            {showEditDialog && editAppointment && (
                <EditDialog />
            )}
        </div>
    );
}

export default Calendar;