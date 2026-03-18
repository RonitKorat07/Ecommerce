import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const variants = {
    success: {
        icon: <CheckCircle className="text-emerald-500" size={18} />,
        border: 'border-emerald-500',
        iconBg: 'bg-emerald-50',
        progress: 'bg-emerald-500',
    },
    error: {
        icon: <XCircle className="text-rose-500" size={18} />,
        border: 'border-rose-500',
        iconBg: 'bg-rose-50',
        progress: 'bg-rose-500',
    },
    warning: {
        icon: <AlertTriangle className="text-amber-500" size={18} />,
        border: 'border-amber-50',
        iconBg: 'bg-amber-100', // Amber-50 is very light, using 100 for better contrast or matching user request
        progress: 'bg-amber-500',
        border: 'border-amber-500',
    },
    info: {
        icon: <Info className="text-indigo-500" size={18} />,
        border: 'border-indigo-500',
        iconBg: 'bg-indigo-50',
        progress: 'bg-indigo-500',
    },
};

const ToastItem = ({ title, message, type = 'info', onClose }) => {
    const config = variants[type] || variants.info;
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - (100 / 30))); // 3000ms / 100ms interval = 30 steps
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`relative w-80 bg-white shadow-lg rounded-xl border-l-4 ${config.border} p-4 flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300 overflow-hidden`}>
            {/* Left: Icon Container */}
            <div className={`shrink-0 w-8 h-8 ${config.iconBg} rounded-full flex items-center justify-center`}>
                {config.icon}
            </div>

            {/* Middle: Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">{title}</h4>
                <p className="text-xs font-medium text-slate-500 leading-tight mt-0.5">{message}</p>
            </div>

            {/* Right: Close Button */}
            <button onClick={onClose} className="shrink-0 p-1 hover:bg-slate-50 rounded-md transition-colors">
                <X size={16} className="text-slate-400 hover:text-slate-600" />
            </button>

            {/* Bottom: Progress Bar */}
            <div 
                className={`absolute bottom-0 left-0 h-1 ${config.progress} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ToastItem;
