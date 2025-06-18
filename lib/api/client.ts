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

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = new Headers({
      ...this.config.headers,
      'X-Language': this.config.language!,
      ...((options.headers as Record<string, string>) || {})
    });

    // Add guest token if available
    if (this.config.guestToken) {
      headers.set('X-Guest-Token', this.config.guestToken);
    }

    // Add auth token if available
    if (this.config.authToken) {
      headers.set('Authorization', `Bearer ${this.config.authToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    const filteredParams = params
      ? (Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        ) as Record<string, string | number>)
      : undefined;

    const queryString = filteredParams
      ? '?' + new URLSearchParams(filteredParams as Record<string, string>).toString()
      : '';
    return this.fetch<T>(`${endpoint}${queryString}`);
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
