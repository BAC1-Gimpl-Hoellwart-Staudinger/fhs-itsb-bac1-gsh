import { BiCheck } from 'react-icons/bi';
import Appointment from '../../../utils/Appointment';

function AppointmentColors(props) {
    const { selectedColor, setSelectedColor } = props;

    return (
        <div className="flex flex-row gap-1 items-center">
            {Appointment.colors.map((color) => (
                <button
                    key={color}
                    type='button'
                    className={`${color} w-8 h-8 rounded-full flex items-center justify-center text-white`}
                    onClick={() => setSelectedColor(color)}
                >
                    {color === selectedColor && <BiCheck size={18} />}
                </button>
            ))}
        </div>
    );
}

export default AppointmentColors;