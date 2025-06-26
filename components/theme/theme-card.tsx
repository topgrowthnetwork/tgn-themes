import { ReactNode } from 'react';

interface ThemeCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function ThemeCard({ children, className = '', variant = 'default' }: ThemeCardProps) {
  const baseClasses = 'rounded-theme p-6';

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-primary-200'
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>;
}
