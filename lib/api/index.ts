export * from './client';
export * from './endpoints';
export * from './types';

import { getCookie } from 'cookies-next';
import { ApiClient } from './client';
import { ApiEndpoints } from './endpoints';
import { ApiConfig } from './types';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function createApi({ language = 'en' }: Pick<ApiConfig, 'language'> = {}) {
  // Get tokens from cookies (works in both client and server)
  const guestToken = getCookie('guest_token');
  const authToken = getCookie('auth_token');

  const client = new ApiClient({
    baseURL: DEFAULT_BASE_URL,
    language,
    guestToken,
    authToken
  });

  return new ApiEndpoints(client);
}
