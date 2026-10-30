import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};