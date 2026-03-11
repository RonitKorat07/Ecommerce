import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Logo = ({ className = "w-6 h-6", textClassName = "text-lg" }) => {
  return (
    <div className={`flex items-center gap-1.5 font-bold cursor-pointer select-none`}>
      <div 
        className={`flex items-center justify-center rounded-lg text-white shadow-md p-1.5`}
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <ShoppingBag className={className} />
      </div>
      <span 
        className={`tracking-tight ${textClassName}`}
        style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--text-main)'
        }}
      >
        Shop<span style={{ color: 'var(--accent)' }}>Ease</span>
      </span>
    </div>
  );
};

export default Logo;
