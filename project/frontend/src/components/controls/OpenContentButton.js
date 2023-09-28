import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function FormContentButton(props) {
    const { isContentOpen, handleClick } = props;

    return (
        <div className="w-full md:mt-4 mt-2">
            <button
                className="flex justify-center items-center gap-2 border border-slate-900 p-2 rounded-md w-full"
                onClick={handleClick}
            >
                {isContentOpen ? 'Close' : 'Open'} Details 
                {isContentOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
        </div>
    );
}

export default FormContentButton;