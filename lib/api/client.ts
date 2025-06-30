import * as Sentry from '@sentry/nextjs';
import { err, ok, Result } from 'neverthrow';
import { ApiConfig, ApiError, ApiResponse } from './types';

// Helper function to create ApiError objects
function createApiError(
  message: string,
  statusCode?: number,
  additionalData?: Record<string, any>
): ApiError {
  return {
    success: false,
    message,
    status_code: statusCode,
    ...additionalData
  };
}

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
  ): Promise<Result<ApiResponse<T>, ApiError>> {
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

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // Get the error response body for better debugging
        const errorText = await response.text();
        let errorData: any = {};

        try {
          errorData = JSON.parse(errorText);
        } catch {
          // If response is not JSON, use the text as message
          errorData = { message: errorText };
        }

        // Create a proper ApiError object
        const apiError = createApiError(errorData.message || response.statusText, response.status, {
          errors: errorData.errors,
          ...errorData // Include any additional error properties
        });

        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: apiError
        });

        // Send error to Sentry with context
        Sentry.captureException(new Error(`API Error: ${apiError.message}`), {
          tags: {
            component: 'api-client',
            endpoint: endpoint,
            method: options.method || 'GET',
            status_code: response.status.toString()
          },
          extra: {
            url,
            status: response.status,
            statusText: response.statusText,
            error: apiError,
            requestHeaders: Object.fromEntries(headers.entries()),
            responseBody: errorText
          },
          level: 'error'
        });

        return err(apiError);
      }

      const data = await response.json();
      return ok(data);
    } catch (error) {
      // Handle network errors or other unexpected errors
      const apiError = createApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        error instanceof Error && 'status' in error ? (error as any).status : undefined
      );

      console.error('API Error:', apiError);

      // Send network error to Sentry with context
      Sentry.captureException(
        error instanceof Error ? error : new Error('Network error occurred'),
        {
          tags: {
            component: 'api-client',
            endpoint: endpoint,
            method: options.method || 'GET',
            error_type: 'network_error'
          },
          extra: {
            url,
            apiError,
            requestHeaders: Object.fromEntries(headers.entries()),
            originalError: error
          },
          level: 'error'
        }
      );

      return err(apiError);
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
    tags?: string[]
  ): Promise<Result<ApiResponse<T>, ApiError>> {
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

  async post<T>(endpoint: string, data?: any): Promise<Result<ApiResponse<T>, ApiError>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.fetch<T>(endpoint, {
      method: 'DELETE'
    });
  }
}
