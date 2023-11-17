import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import 'dayjs/locale/de-at';

function TimePickerMUI(props) {
    const {
        label,
        selectedTimePickerTime,
        setSelectedTimePickerTime,
        disabled = false,
    } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de-at'>
            <TimePicker
                label={label}
                value={selectedTimePickerTime}
                onChange={(newValue) => setSelectedTimePickerTime(newValue)}
                disabled={disabled}
            />
        </LocalizationProvider>
    );
}

export default TimePickerMUI;