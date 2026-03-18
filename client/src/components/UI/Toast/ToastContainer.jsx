import React from 'react';
import ToastItem from './ToastItem';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem 
                        {...toast} 
                        onClose={() => removeToast(toast.id)} 
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
