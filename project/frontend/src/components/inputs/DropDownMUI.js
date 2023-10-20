import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function DropDownMUI(props) {
    const { label, menuItems } = props;
    const [value, setValue] = useState('');

    function handleChange(event) {
        setValue(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
                <Select
                    labelId={`select-label-${label}`}
                    value={value}
                    label={label}
                    onChange={handleChange}
                >
                    {menuItems.map((menuItem, menuItemIndex) => (
                        <MenuItem
                            key={menuItemIndex}
                            value={menuItem.value}
                        >
                            {menuItem.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default DropDownMUI;