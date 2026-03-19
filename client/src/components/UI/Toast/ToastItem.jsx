import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants = {
    success: {
        icon: <CheckCircle size={18} />,
        containerClass: 'bg-emerald-500',
        progress: 'bg-white/40',
    },
    error: {
        icon: <XCircle size={18} />,
        containerClass: 'bg-rose-500',
        progress: 'bg-white/40',
    },
    warning: {
        icon: <AlertTriangle size={18} />,
        containerClass: 'bg-amber-500',
        progress: 'bg-white/40',
    },
    info: {
        icon: <Info size={18} />,
        containerClass: 'bg-[#0F4C81]',
        progress: 'bg-white/40',
    },
};

const ToastItem = ({ title, message, type = 'info', onClose }) => {
    const config = variants[type] || variants.info;
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return Math.max(0, prev - (100 / 40));
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className={`relative w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl flex items-stretch transition-all duration-500 ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
        >
            {/* Colored Icon Column */}
            <div className={`${config.containerClass} flex items-center justify-center px-4 text-white shrink-0`}>
                {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-800 leading-tight">{title}</h4>
                        <p className="text-[11px] font-medium text-slate-500 leading-snug mt-0.5">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 mt-0.5 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={13} className="text-slate-400" />
                    </button>
                </div>
                {/* Progress bar */}
                <div className="mt-2.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${config.containerClass} rounded-full transition-all duration-100 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToastItem;
