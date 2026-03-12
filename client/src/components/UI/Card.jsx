import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-hover)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-[var(--border-light)] ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 border-t border-[var(--border-light)] ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardBody, CardFooter };
