'use client';

import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { CheckoutRequest, CheckoutResponse, ContactRequest, ContactResponse } from '../../api/types';
import { FetcherError, postFetcher } from './fetcher';

interface UseCheckoutReturn {
  checkout: (data: CheckoutRequest) => Promise<CheckoutResponse>;
  isLoading: boolean;
  error: FetcherError | null;
}

/**
 * Checkout mutation hook
 */
export function useCheckout(): UseCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherError | null>(null);

  const checkout = useCallback(async (data: CheckoutRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await postFetcher<CheckoutResponse>('/api/orders', data);
      // Invalidate cart cache after successful checkout
      await mutate('/api/carts');
      return result;
    } catch (err) {
      const fetcherError = err instanceof FetcherError ? err : null;
      setError(fetcherError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    checkout,
    isLoading,
    error
  };
}

interface UseContactReturn {
  submitContact: (data: ContactRequest) => Promise<ContactResponse>;
  isLoading: boolean;
  error: FetcherError | null;
}

/**
 * Contact form mutation hook
 */
export function useContact(): UseContactReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherError | null>(null);

  const submitContact = useCallback(async (data: ContactRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await postFetcher<ContactResponse>('/api/contacts', data);
      return result;
    } catch (err) {
      const fetcherError = err instanceof FetcherError ? err : null;
      setError(fetcherError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    submitContact,
    isLoading,
    error
  };
}

/**
 * Standalone checkout action
 */
export async function checkoutAction(data: CheckoutRequest) {
  return postFetcher<CheckoutResponse>('/api/orders', data);
}

/**
 * Standalone contact action
 */
export async function submitContactAction(data: ContactRequest) {
  return postFetcher<ContactResponse>('/api/contacts', data);
}

