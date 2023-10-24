import { useState } from 'react';
import ReactDOM from 'react-dom';
import { GrFormClose } from 'react-icons/gr';

function useModal() {
    const [showModal, setShowModal] = useState(false);

    return {
        showModal,
        setShowModal,
        Modal,
    }
}

function Modal({ label, showModal, setShowModal, children }) {
    if(!showModal) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-100">
            <div
                className="fixed inset-0 bg-black/20"
                onClick={() => setShowModal(false)}
            />
            <div className="relative w-[60vw] bg-white p-8 rounded-md">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="font-bold text-xl">{label}</h2>
                    <div
                        className="cursor-pointer"
                        onClick={() => setShowModal(false)}
                    >
                        <GrFormClose size={22} />
                    </div>
                </div>
                <div className="overflow-y-scroll overflow-x-hidden h-[600px]">
                    {children}
                </div>
            </div>
        </div>
        , document.getElementById('modal-root')
    );
}

export default useModal;