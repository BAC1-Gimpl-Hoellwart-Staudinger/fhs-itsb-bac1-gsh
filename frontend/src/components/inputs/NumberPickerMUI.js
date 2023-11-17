import { TextField } from '@mui/material';

function NumberPickerMUI(props) {
    const { label, value, setValue, minValue, maxValue, size = 'normal' } = props;

    const isOutOfRange = value > maxValue || value < minValue;

    function handleChange(event) {
        setValue(event.target.value);
    }

    return (
        <TextField
            id={label.toLowerCase()}
            name={label.toLowerCase()}
            label={label}
            type="number"
            inputProps={{
                min: minValue,
                max: maxValue,
            }}
            value={value}
            onChange={handleChange}
            error={isOutOfRange}
            helperText={isOutOfRange ? `Value must be between ${minValue} and ${maxValue}` : ''}
            size={size}
        />
    );
}

export default NumberPickerMUI;