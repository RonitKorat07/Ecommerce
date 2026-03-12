import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({ value, onChange, options = [], label, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`w-full ${className}`} ref={ref}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 py-2 px-3 rounded-lg border text-sm text-left transition-all outline-none ${
            isOpen
              ? 'border-[var(--primary)] ring-2 ring-[rgba(15,76,129,0.08)] bg-white'
              : 'border-[var(--border-light)] bg-[var(--bg-body)] hover:border-slate-300'
          }`}
        >
          <span className={selectedOption ? 'text-[var(--text-main)]' : 'text-slate-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-[var(--border-light)] shadow-lg py-1 max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isSelected
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-body)]'
                  }`}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && <Check size={14} className="text-[var(--primary)] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
