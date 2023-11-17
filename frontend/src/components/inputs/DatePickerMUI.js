import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de-at';

function DatePickerMUI(props) {
    const {
        label,
        selectedDatePickerDate,
        setSelectedDatePickerDate,
        textFieldSize = 'normal'
    } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de-at'>
            <DatePicker
                label={label}
                value={selectedDatePickerDate}
                onChange={(newValue) => setSelectedDatePickerDate(newValue)}
                slotProps={{ textField: { size: textFieldSize } }}
            />
        </LocalizationProvider>
    );
}

export default DatePickerMUI;