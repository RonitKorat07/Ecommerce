import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ trigger, children, className = '', align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute ${alignments[align]} mt-2 min-w-[200px] bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl shadow-[var(--shadow-hover)] z-[100] py-2 animate-in fade-in zoom-in duration-200 origin-top-right`}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                onClick: (e) => {
                  if (child.props.onClick) child.props.onClick(e);
                  setIsOpen(false);
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ children, className = '', ...props }) => (
  <div 
    className={`px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-body)] hover:text-[var(--primary)] cursor-pointer transition-colors border-b last:border-0 border-[var(--border-light)] ${className}`}
    {...props}
  >
    {children}
  </div>
);

export { Dropdown, DropdownItem };
