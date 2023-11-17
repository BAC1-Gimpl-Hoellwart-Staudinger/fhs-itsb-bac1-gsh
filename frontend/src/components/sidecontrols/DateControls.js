import { useContext } from 'react';
import { CalendarContext } from '../../contexts/CalendarContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineToday } from 'react-icons/md';
import dayjs from 'dayjs';

function DateControls() {
    const { date, viewScale, setDate, VIEW_SCALES } = useContext(CalendarContext);
    const formattedDate = dayjs(date).format('MMMM YYYY');

    const controlsStyle = "hover:bg-gray-200 rounded-full p-1 h-7 w-7 flex items-center justify-center transition-colors duration-200 ease-in-out";

    function handlePrevDateClick() {
        switch(viewScale) {
            case VIEW_SCALES.day:
                setDate(dayjs(date).subtract(1, 'day'));
                break;
            case VIEW_SCALES.week:
                setDate(dayjs(date).subtract(1, 'week'));
                break;
            default:
                setDate(dayjs(date).subtract(1, 'month'));
                break;
        }
    }

    function handleTodayClick() {
        setDate(dayjs().startOf('day'));
    }

    function handleNextDateClick() {
        switch(viewScale) {
            case VIEW_SCALES.day:
                setDate(dayjs(date).add(1, 'day'));
                break;
            case VIEW_SCALES.week:
                setDate(dayjs(date).add(1, 'week'));
                break;
            default:
                setDate(dayjs(date).add(1, 'month'));
                break;
        }
    }

    return (
        <div className="flex items-center gap-3 h-14 mb-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevDateClick}
                    className={controlsStyle}
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={handleTodayClick}
                    className={`${controlsStyle} p-1.5 h-auto w-auto`}
                >
                    <MdOutlineToday size={24} />
                </button>
                <button
                    onClick={handleNextDateClick}
                    className={controlsStyle}
                >
                    <FaChevronRight />
                </button>
            </div>

            <div className="text-base font-semibold flex-grow text-center ml-2 md:text-xl md:text-left md:flex-grow-0">
                {formattedDate}
            </div>
        </div>
    );
}

export default DateControls;