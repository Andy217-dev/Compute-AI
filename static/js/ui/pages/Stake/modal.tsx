import React from 'react';
import './modal.scss';

// @ts-ignore
const Modal = ({isOpen, onClose, title,children}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className='modal-title'>
                    <div>{title}</div>
                    <button className='close-button' onClick={onClose}>×</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;