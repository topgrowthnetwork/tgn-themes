import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className }: LoadingSpinnerProps) {
  const t = useTranslations('Common');
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={t('loading')}
    >
      <span className="sr-only">{t('loading')}...</span>
    </div>
  );
}

// Convenience components for common use cases
export function ButtonLoadingSpinner({ className }: { className?: string }) {
  return <LoadingSpinner size="sm" color="white" className={className} />;
}

export function InputLoadingSpinner({ className }: { className?: string }) {
  return <LoadingSpinner size="sm" color="primary" className={className} />;
}

export function PageLoadingSpinner({ className }: { className?: string }) {
  return <LoadingSpinner size="lg" color="primary" className={className} />;
}
