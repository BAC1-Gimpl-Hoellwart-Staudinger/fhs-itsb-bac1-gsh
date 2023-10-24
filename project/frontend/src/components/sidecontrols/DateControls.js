import { useContext } from 'react';
import { CalendarContext } from '../../contexts/CalendarContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineToday } from 'react-icons/md';
import dayjs from 'dayjs';

function DateControls() {
    const { date, viewScale, setDate, VIEW_SCALES } = useContext(CalendarContext);
    const formattedDate = dayjs(date).format('MMMM YYYY');

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
        <div className="md:grid md:grid-cols-[1fr,3fr] flex xl:flex xl:gap-8">
            <div className="flex gap-2">
                <button
                    onClick={handlePrevDateClick}
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={handleTodayClick}
                >
                    <MdOutlineToday size={18} />
                </button>
                <button
                    onClick={handleNextDateClick}
                >
                    <FaChevronRight />
                </button>
            </div>

            <div className="text-base md:text-xl flex-grow text-center md:text-left md:flex-grow-0 font-semibold">
                {formattedDate}
            </div>
        </div>
    );
}

export default DateControls;