'use client';

import { getCookie } from 'cookies-next';
import { ApiError, ApiResponse } from '../../api/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Get language from cookie or default to 'en'
  const language = getCookie('NEXT_LOCALE') || 'en';
  headers['X-Language'] = language as string;

  // Get guest token
  const guestToken = getCookie('guest_token');
  if (guestToken) {
    headers['X-Guest-Token'] = guestToken as string;
  }

  // Get auth token
  const authToken = getCookie('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

export class FetcherError extends Error {
  status: number;
  info: ApiError;

  constructor(message: string, status: number, info: ApiError) {
    super(message);
    this.name = 'FetcherError';
    this.status = status;
    this.info = info;
  }
}

/**
 * SWR fetcher for GET requests
 */
export async function fetcher<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new FetcherError(
      errorData.message || 'An error occurred',
      response.status,
      errorData as ApiError
    );
  }

  const data: ApiResponse<T> = await response.json();
  return data.data;
}

/**
 * POST request helper for mutations
 */
export async function postFetcher<T, D = any>(endpoint: string, data?: D): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new FetcherError(
      errorData.message || 'An error occurred',
      response.status,
      errorData as ApiError
    );
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

/**
 * PUT request helper for mutations
 */
export async function putFetcher<T, D = any>(endpoint: string, data?: D): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new FetcherError(
      errorData.message || 'An error occurred',
      response.status,
      errorData as ApiError
    );
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

/**
 * DELETE request helper for mutations
 */
export async function deleteFetcher<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new FetcherError(
      errorData.message || 'An error occurred',
      response.status,
      errorData as ApiError
    );
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

/**
 * Build query string from params object
 */
export function buildQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined)
  ) as Record<string, string | number>;

  if (Object.keys(filteredParams).length === 0) return '';

  return '?' + new URLSearchParams(filteredParams as Record<string, string>).toString();
}

