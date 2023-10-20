import { useContext } from 'react';
import { CalendarContext } from '../../contexts/CalendarContext';

function ViewScaleButtons() {
    const { setViewScale, VIEW_SCALES } = useContext(CalendarContext);

    const commonStyle = 'border border-slate-900 p-2 flex-grow font-semibold';

    return (
        <div className="flex">
                <button
                    className={`${commonStyle} rounded-l-md`}
                    onClick={() => setViewScale(VIEW_SCALES.day)}
                >
                    Today
                </button>
                <button
                    className={commonStyle}
                    onClick={() => setViewScale(VIEW_SCALES.week)}
                >
                    Week
                </button>
                <button
                    className={`${commonStyle} rounded-r-md`}
                    onClick={() => setViewScale(VIEW_SCALES.month)}
                >
                    Month
                </button>
            </div>
    );
}

export default ViewScaleButtons;