import { ToastNotification, type ToastType } from '@shared/components/toast-notification';

interface NotificationMessageProps {
  message: string | null;
  type?: ToastType;
  className?: string;
}

export function NotificationMessage({
  message,
  type = 'info',
  className
}: NotificationMessageProps) {
  return (
    <ToastNotification
      message={message}
      type={type}
      autoClose={type === 'success' ? 5000 : false}
    />
  );
}
