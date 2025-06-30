'use client';

import { useEffect } from 'react';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastNotificationProps {
  message: string | null;
  type?: ToastType;
  autoClose?: number | false;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored';
  className?: string;
}

export function ToastNotification({
  message,
  type = 'info',
  autoClose = 5000,
  position = 'top-right',
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
  theme = 'light',
  className
}: ToastNotificationProps) {
  useEffect(() => {
    if (message) {
      const toastOptions: ToastOptions = {
        type,
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        theme
      };

      toast(message, toastOptions);
    }
  }, [
    message,
    type,
    autoClose,
    position,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    theme
  ]);

  // Return null since this component only triggers toasts
  return null;
}

// Toast container component that should be placed in your layout
export function ToastContainerWrapper({ className }: { className?: string }) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className={className}
    />
  );
}

// Convenience functions for manual toast triggering
export const showToast = {
  success: (message: string, options?: ToastOptions) => toast.success(message, options),
  error: (message: string, options?: ToastOptions) => toast.error(message, options),
  info: (message: string, options?: ToastOptions) => toast.info(message, options),
  warning: (message: string, options?: ToastOptions) => toast.warning(message, options)
};

// Convenience components for specific toast types
export function SuccessToast(props: Omit<ToastNotificationProps, 'type'>) {
  return <ToastNotification {...props} type="success" />;
}

export function ErrorToast(props: Omit<ToastNotificationProps, 'type'>) {
  return <ToastNotification {...props} type="error" />;
}

export function InfoToast(props: Omit<ToastNotificationProps, 'type'>) {
  return <ToastNotification {...props} type="info" />;
}

export function WarningToast(props: Omit<ToastNotificationProps, 'type'>) {
  return <ToastNotification {...props} type="warning" />;
}
