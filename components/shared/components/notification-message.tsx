import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationMessageProps {
  message: string | null;
  type?: NotificationType;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
  className?: string;
}

export function NotificationMessage({
  message,
  type = 'info',
  onDismiss,
  autoDismiss = false,
  dismissDelay = 5000,
  className
}: NotificationMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss functionality
  useState(() => {
    if (autoDismiss && message && dismissDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissDelay);
      return () => clearTimeout(timer);
    }
  });

  if (!message || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-theme border p-4 transition-all duration-300',
        getStyles(),
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-theme p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Dismiss notification"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Convenience components for specific message types
export function SuccessMessage(props: Omit<NotificationMessageProps, 'type'>) {
  return <NotificationMessage {...props} type="success" />;
}

export function ErrorMessage(props: Omit<NotificationMessageProps, 'type'>) {
  return <NotificationMessage {...props} type="error" />;
}

export function InfoMessage(props: Omit<NotificationMessageProps, 'type'>) {
  return <NotificationMessage {...props} type="info" />;
}

export function WarningMessage(props: Omit<NotificationMessageProps, 'type'>) {
  return <NotificationMessage {...props} type="warning" />;
}
