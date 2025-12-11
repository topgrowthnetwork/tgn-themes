'use client';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartnersResponse } from '../../api/types';
import { fetcher } from './fetcher';

/**
 * Fetch partners
 */
export function usePartners() {
  return useSWR<PartnersResponse>('/api/partners', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000 // 5 minutes
  });
}

/**
 * Fetch partners (immutable)
 */
export function usePartnersImmutable() {
  return useSWRImmutable<PartnersResponse>('/api/partners', fetcher);
}

