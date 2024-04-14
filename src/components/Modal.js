import React from 'react';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-white p-6 rounded shadow-lg w-1/4 absolute top-8">
                {children}
                <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700">
                    ✖️
                </button>
            </div>
        </div>
    );
}

export default Modal;
