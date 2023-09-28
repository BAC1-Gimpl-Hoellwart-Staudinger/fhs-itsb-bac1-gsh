import { useContext, useState } from 'react';
import { CalendarContext } from '../contexts/CalendarContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineToday } from 'react-icons/md';
import OpenContentButton from './controls/OpenContentButton';
import dayjs from 'dayjs';

function SideControls() {
    const { date, viewScale, setDate, setViewScale } = useContext(CalendarContext);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const formattedDate = dayjs(date).format('MMMM YYYY');

    function handlePrevDateClick() {
        switch(viewScale) {
            case 'day':
                setDate(dayjs(date).subtract(1, 'day'));
                break;
            case 'week':
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
            case 'day':
                setDate(dayjs(date).add(1, 'day'));
                break;
            case 'week':
                setDate(dayjs(date).add(1, 'week'));
                break;
            default:
                setDate(dayjs(date).add(1, 'month'));
                break;
        }
    }

    function handleShowContent() {
        setIsContentOpen((prevState) => !prevState);
    }

    return (
        <div className="h-auto md:h-full w-full bg-gray-50 py-5 px-8 flex flex-col gap-2">
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

                <div className="text-base md:text-xl flex-grow text-center md:text-left md:flex-grow-0">
                    {formattedDate}
                </div>
            </div>

        	<div className="flex">
                <button
                    className="border border-slate-900 p-2 rounded-l-md flex-grow"
                    onClick={() => setViewScale('day')}
                >
                    Today
                </button>
                <button
                    className="border border-slate-900 p-2 flex-grow"
                    onClick={() => setViewScale('week')}
                >
                    Week
                </button>
                <button
                    className="border border-slate-900 p-2 rounded-r-md flex-grow"
                    onClick={() => setViewScale('month')}
                >
                    Month
                </button>
            </div>

            {isContentOpen ? (
                <>
                    <OpenContentButton
                        isContentOpen={isContentOpen}
                        handleClick={handleShowContent}
                    />
                    <div>
                        <h1 className="font-bold">Details will go here</h1>
                    </div>
                </>
            ) : (
                <OpenContentButton
                    isContentOpen={isContentOpen}
                    handleClick={handleShowContent}
                />
            )}
        </div>
    );
}

export default SideControls;