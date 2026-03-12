import React from 'react';

const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[var(--text-muted)]">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors">
            <Icon size={16} />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-9' : 'px-4'} pr-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-body)] text-[var(--text-main)] text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(37,99,235,0.1)] placeholder:text-gray-400`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
};

export default Input;
