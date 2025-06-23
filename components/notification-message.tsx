import clsx from 'clsx';

interface NotificationMessageProps {
  message: string | null;
  type?: 'success' | 'error' | 'info' | 'warning';
  className?: string;
}

export function NotificationMessage({
  message,
  type = 'info',
  className
}: NotificationMessageProps) {
  if (!message) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div
      className={clsx(
        'rounded-lg p-3 text-sm font-medium transition-all duration-200',
        getStyles(),
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
