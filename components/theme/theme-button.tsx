import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ThemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ThemeButtonProps) {
  const baseClasses =
    'rounded-theme font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
    secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200 active:bg-primary-300',
    outline:
      'border border-primary-300 bg-white text-primary-700 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary-700 hover:bg-primary-100 active:bg-primary-200'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
