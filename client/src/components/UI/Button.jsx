import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed rounded-xl";
  
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-[0_4px_12px_rgba(37,99,235,0.2)]",
    orange: "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] shadow-[0_4px_12px_rgba(255,122,0,0.2)]",
    outline: "border-2 border-[var(--border-light)] text-[var(--text-main)] hover:border-[var(--primary)] hover:text-[var(--primary)] bg-transparent",
    ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-body)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90 shadow-[0_4px_12px_rgba(239,68,68,0.2)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {typeof children === 'string' ? 'Loading...' : children}
        </span>
      ) : children}
    </button>
  );
};

export default Button;
