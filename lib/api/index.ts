import { ApiClient } from './client';
import { ApiEndpoints } from './endpoints';
import { ApiConfig } from './types';

// We don't use cookies/headers here as this is used in statically generated pages
export function createApi({
  language = 'en',
  guestToken,
  authToken,
  timeout
}: Pick<ApiConfig, 'language' | 'guestToken' | 'authToken' | 'timeout'>) {
  const client = new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    language,
    guestToken,
    authToken,
    timeout
  });

  const apiEndpoints = new ApiEndpoints(client);
  return apiEndpoints;
}
