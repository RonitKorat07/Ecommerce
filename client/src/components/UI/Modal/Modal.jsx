import React, { useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react';
import Button from '../Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "info", // "info" | "warning" | "success" | "danger" | "confirm"
  showClose = true,
  maxWidth = "max-w-md"
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const icons = {
    info: <Info className="text-blue-500" size={24} />,
    warning: <AlertTriangle className="text-amber-500" size={24} />,
    success: <CheckCircle className="text-emerald-500" size={24} />,
    danger: <AlertTriangle className="text-red-500" size={24} />,
    confirm: <HelpCircle className="text-[var(--primary)]" size={24} />,
  };

  const backdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={backdropClick}
    >
      <div 
        className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden animate-in zoom-in-95 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-[var(--bg-body)]`}>
              {icons[type]}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h3>
          </div>
          {showClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
          <div className="text-[var(--text-muted)] text-[15px] leading-relaxed">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[var(--border-light)] flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            size="md" 
            onClick={onClose}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button 
              variant={type === 'danger' ? 'danger' : 'orange'} 
              size="md" 
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
