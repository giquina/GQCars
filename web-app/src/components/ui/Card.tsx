import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  elevated = false,
  padding = 'md',
  onClick,
  selected = false,
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 transition-all duration-200';
  
  const elevationClasses = elevated ? 'shadow-lg' : 'shadow-md';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : '';
  
  const selectedClasses = selected ? 'border-primary-500 bg-primary-50 shadow-md transform scale-[1.02]' : '';
  
  return (
    <div
      className={clsx(
        baseClasses,
        elevationClasses,
        paddingClasses[padding],
        interactiveClasses,
        selectedClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;