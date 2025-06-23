import { ApiConfig, ApiResponse } from './types';

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      baseURL: config.baseURL,
      headers: {
        ...config.headers
      },
      language: config.language || 'en',
      guestToken: config.guestToken,
      authToken: config.authToken
    };
  }

  setGuestToken(token: string) {
    this.config.guestToken = token;
  }

  setAuthToken(token: string) {
    this.config.authToken = token;
  }

  clearTokens() {
    this.config.guestToken = undefined;
    this.config.authToken = undefined;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    tags?: string[]
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = new Headers({
      ...this.config.headers,
      'X-Language': this.config.language!,
      'X-CSRF-TOKEN': '',
      ...((options.headers as Record<string, string>) || {})
    });

    // Set Content-Type based on body type
    if (options.body) {
      if (options.body instanceof FormData) {
        // Don't set Content-Type for FormData - browser will set it with boundary
      } else if (typeof options.body === 'string') {
        try {
          // Try to parse as JSON to determine if it's JSON
          JSON.parse(options.body);
          headers.set('Content-Type', 'application/json');
        } catch {
          // If it's not valid JSON, don't set Content-Type
        }
      }
    }

    // Add guest token if available
    if (this.config.guestToken) {
      headers.set('X-Guest-Token', this.config.guestToken);
    }

    // Add auth token if available
    if (this.config.authToken) {
      headers.set('Authorization', `Bearer ${this.config.authToken}`);
    }

    // Use Next.js fetch with caching for GET requests
    const fetchOptions: RequestInit = {
      ...options,
      headers
    };

    // Add caching for GET requests with optional tags
    if ((options.method === 'GET' || !options.method) && tags) {
      fetchOptions.next = {
        tags
      };
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      // Get the error response body for better debugging
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    tags?: string[]
  ): Promise<ApiResponse<T>> {
    const filteredParams = params
      ? (Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        ) as Record<string, string | number>)
      : undefined;

    const queryString = filteredParams
      ? '?' + new URLSearchParams(filteredParams as Record<string, string>).toString()
      : '';
    return this.fetch<T>(`${endpoint}${queryString}`, { method: 'GET' }, tags);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'DELETE'
    });
  }
}
