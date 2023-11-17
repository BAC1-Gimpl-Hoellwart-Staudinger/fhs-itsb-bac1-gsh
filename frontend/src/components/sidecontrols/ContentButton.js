import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function ContentButton(props) {
    const { isContentOpen, handleClick } = props;

    return (
        <div className="w-full md:mt-4 mt-2">
            <button
                className="flex justify-center items-center gap-2 border border-slate-900 p-2 rounded-md w-full font-semibold
                    hover:bg-slate-900 hover:text-white transition-all duration-200 ease-in-out"
                onClick={handleClick}
            >
                {isContentOpen ? 'Close' : 'Open'} Actions 
                {isContentOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
        </div>
    );
}

export default ContentButton;