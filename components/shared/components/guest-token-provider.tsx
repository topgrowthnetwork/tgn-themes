'use client';

import { createApi } from 'lib/api';
import { ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface GuestTokenProviderProps {
  children: ReactNode;
}

export default function GuestTokenProvider({ children }: GuestTokenProviderProps) {
  const [cookies, setCookie] = useCookies(['guest_token']);

  useEffect(() => {
    const createGuestToken = async () => {
      // Check if guest token already exists
      if (cookies.guest_token) {
        return; // Token already exists, no need to create a new one
      }

      try {
        const api = createApi({});
        const apiResult = await api.generateGuestToken();

        if (apiResult.isOk() && apiResult.value.data.guest_token) {
          // Set the guest token cookie using react-cookie
          setCookie('guest_token', apiResult.value.data.guest_token, {
            path: '/',
            maxAge: 10 * 365 * 24 * 60 * 60, // 10 years (effectively never expires)
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          });
        }
      } catch (error) {
        console.error('Failed to generate guest token:', error);
        // Silently fail - the app should still work without a guest token
      }
    };

    createGuestToken();
  }, [cookies.guest_token, setCookie]);

  return <>{children}</>;
}
