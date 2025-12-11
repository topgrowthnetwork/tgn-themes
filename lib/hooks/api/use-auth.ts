'use client';

import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import {
  AuthResponse,
  ForgotPasswordRequest,
  GuestTokenResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest
} from '../../api/types';
import { FetcherError, postFetcher } from './fetcher';

interface UseAuthReturn {
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<{ message: string }>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<{ message: string }>;
  resetPassword: (data: ResetPasswordRequest) => Promise<{ message: string }>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<{ message: string }>;
  sendVerificationEmail: () => Promise<{ message: string }>;
  refreshToken: () => Promise<AuthResponse>;
  generateGuestToken: () => Promise<GuestTokenResponse>;
  isLoading: boolean;
  error: FetcherError | null;
}

/**
 * Auth mutations hook
 */
export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherError | null>(null);

  const handleMutation = useCallback(async <T>(mutation: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutation();
      return result;
    } catch (err) {
      const fetcherError = err instanceof FetcherError ? err : null;
      setError(fetcherError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      return handleMutation(async () => {
        const result = await postFetcher<AuthResponse>('/api/login', data);
        // Invalidate cart cache after login (cart might be merged)
        await mutate('/api/carts');
        return result;
      });
    },
    [handleMutation]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      return handleMutation(() => postFetcher<AuthResponse>('/api/register', data));
    },
    [handleMutation]
  );

  const logout = useCallback(async () => {
    return handleMutation(async () => {
      const result = await postFetcher<{ message: string }>('/api/logout');
      // Invalidate all cached data after logout
      await mutate(() => true, undefined, { revalidate: false });
      return result;
    });
  }, [handleMutation]);

  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest) => {
      return handleMutation(() => postFetcher<{ message: string }>('/api/forgot-password', data));
    },
    [handleMutation]
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      return handleMutation(() => postFetcher<{ message: string }>('/api/reset-password', data));
    },
    [handleMutation]
  );

  const verifyEmail = useCallback(
    async (data: VerifyEmailRequest) => {
      return handleMutation(() => postFetcher<{ message: string }>('/api/verify-email', data));
    },
    [handleMutation]
  );

  const sendVerificationEmail = useCallback(async () => {
    return handleMutation(() =>
      postFetcher<{ message: string }>('/api/email/verification-notification')
    );
  }, [handleMutation]);

  const refreshToken = useCallback(async () => {
    return handleMutation(() => postFetcher<AuthResponse>('/api/refresh'));
  }, [handleMutation]);

  const generateGuestToken = useCallback(async () => {
    return handleMutation(() => postFetcher<GuestTokenResponse>('/api/guest-token'));
  }, [handleMutation]);

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerificationEmail,
    refreshToken,
    generateGuestToken,
    isLoading,
    error
  };
}

/**
 * Standalone auth actions (for use outside of React components)
 */
export async function loginAction(data: LoginRequest) {
  return postFetcher<AuthResponse>('/api/login', data);
}

export async function registerAction(data: RegisterRequest) {
  return postFetcher<AuthResponse>('/api/register', data);
}

export async function logoutAction() {
  return postFetcher<{ message: string }>('/api/logout');
}

export async function forgotPasswordAction(data: ForgotPasswordRequest) {
  return postFetcher<{ message: string }>('/api/forgot-password', data);
}

export async function resetPasswordAction(data: ResetPasswordRequest) {
  return postFetcher<{ message: string }>('/api/reset-password', data);
}

export async function verifyEmailAction(data: VerifyEmailRequest) {
  return postFetcher<{ message: string }>('/api/verify-email', data);
}

export async function generateGuestTokenAction() {
  return postFetcher<GuestTokenResponse>('/api/guest-token');
}

