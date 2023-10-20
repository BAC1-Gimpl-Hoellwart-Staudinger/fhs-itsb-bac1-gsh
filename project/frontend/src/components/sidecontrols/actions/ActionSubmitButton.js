import { Button, CircularProgress } from '@mui/material';

function ActionSubmitButtion(props) {
    const { isLoading, children, variant = 2 } = props;

    function generateButtonClass() {
        switch(variant) {
            case 0:
                return 'bg-gradient-to-br from-pink-500 to-orange-400';
            case 1:
                return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';
            default:
                return 'bg-gradient-to-br from-purple-600 to-blue-500';
        }
    }

    return (
        <Button
            className={generateButtonClass()}
            variant="contained"
            disabled={isLoading}
            type="submit"
            sx={{
                padding: '10px 20px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
            }}
        >
            {isLoading ? (
                <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{
                        color: 'white',
                    }}
                />
            ) : (
                children
            )}
        </Button>
    );
}

export default ActionSubmitButtion;