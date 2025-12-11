'use client';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { GlobalSettings, LanguageSettings, PaymentSettings, SlidersResponse } from '../../api/types';
import { fetcher } from './fetcher';

/**
 * Fetch global settings
 * These rarely change, so we use a long deduping interval
 */
export function useGlobalSettings() {
  return useSWR<GlobalSettings>('/api/global-settings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes
  });
}

/**
 * Fetch global settings (immutable)
 */
export function useGlobalSettingsImmutable() {
  return useSWRImmutable<GlobalSettings>('/api/global-settings', fetcher);
}

/**
 * Fetch payment settings
 */
export function usePaymentSettings() {
  return useSWR<PaymentSettings>('/api/payment-settings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes
  });
}

/**
 * Fetch payment settings (immutable)
 */
export function usePaymentSettingsImmutable() {
  return useSWRImmutable<PaymentSettings>('/api/payment-settings', fetcher);
}

/**
 * Fetch language settings
 */
export function useLanguageSettings() {
  return useSWR<LanguageSettings>('/api/language-settings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000 // 10 minutes
  });
}

/**
 * Fetch language settings (immutable)
 */
export function useLanguageSettingsImmutable() {
  return useSWRImmutable<LanguageSettings>('/api/language-settings', fetcher);
}

/**
 * Fetch sliders
 */
export function useSliders() {
  return useSWR<SlidersResponse>('/api/sliders', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000 // 5 minutes
  });
}

/**
 * Fetch sliders (immutable)
 */
export function useSlidersImmutable() {
  return useSWRImmutable<SlidersResponse>('/api/sliders', fetcher);
}

