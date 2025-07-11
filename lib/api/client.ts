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

// Helper function to calculate delay with exponential backoff
function calculateDelay(attempt: number, baseDelay: number, multiplier: number): number {
  return baseDelay * Math.pow(multiplier, attempt - 1);
}

// Helper function to check if an error is retryable
function isRetryableError(
  error: ApiError,
  retryableStatusCodes: number[],
  retryableErrors: string[]
): boolean {
  // Check status code
  if (error.status_code && retryableStatusCodes.includes(error.status_code)) {
    return true;
  }

  // Check error message
  return retryableErrors.some((retryableError) =>
    error.message.toLowerCase().includes(retryableError.toLowerCase())
  );
}

// Helper function to sleep for a given number of milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiClient {
  private config: ApiConfig;
  private defaultRetryConfig = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['Network error occurred', 'Request timeout']
  };

  /**
   * Creates a new API client with optional retry configuration
   *
   * @example
   * // Default retry behavior (3 attempts, 1s base delay, exponential backoff)
   * const client = new ApiClient({ baseURL: 'https://api.example.com' });
   *
   * @example
   * // Custom retry configuration
   * const client = new ApiClient({
   *   baseURL: 'https://api.example.com',
   *   retry: {
   *     maxAttempts: 5,
   *     delayMs: 500,
   *     backoffMultiplier: 1.5,
   *     retryableStatusCodes: [408, 429, 500, 502, 503, 504, 520],
   *     retryableErrors: ['Network error occurred', 'Request timeout', 'Service unavailable']
   *   }
   * });
   */
  constructor(config: ApiConfig) {
    this.config = {
      baseURL: config.baseURL,
      headers: {
        ...config.headers
      },
      language: config.language || 'en',
      guestToken: config.guestToken,
      authToken: config.authToken,
      timeout: config.timeout,
      retry: {
        ...this.defaultRetryConfig,
        ...config.retry
      }
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

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    tags?: string[],
    attempt: number = 1
  ): Promise<Result<ApiResponse<T>, ApiError>> {
    const retryConfig = this.config.retry || this.defaultRetryConfig;
    const maxAttempts = retryConfig.maxAttempts || this.defaultRetryConfig.maxAttempts;
    const delayMs = retryConfig.delayMs || this.defaultRetryConfig.delayMs;
    const backoffMultiplier =
      retryConfig.backoffMultiplier || this.defaultRetryConfig.backoffMultiplier;
    const retryableStatusCodes =
      retryConfig.retryableStatusCodes || this.defaultRetryConfig.retryableStatusCodes;
    const retryableErrors = retryConfig.retryableErrors || this.defaultRetryConfig.retryableErrors;

    try {
      const result = await this.fetch<T>(endpoint, options, tags);

      // If successful, return the result
      if (result.isOk()) {
        return result;
      }

      const error = result.error;

      // Check if we should retry this error
      if (attempt < maxAttempts && isRetryableError(error, retryableStatusCodes, retryableErrors)) {
        const delay = calculateDelay(attempt, delayMs, backoffMultiplier);

        console.warn(
          `API request failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms:`,
          {
            endpoint,
            error: error.message,
            statusCode: error.status_code
          }
        );

        // Wait before retrying
        await sleep(delay);

        // Retry the request
        return this.fetchWithRetry<T>(endpoint, options, tags, attempt + 1);
      }

      // If we shouldn't retry or have exhausted attempts, return the error
      if (attempt > 1) {
        console.error(`API request failed after ${attempt} attempts:`, {
          endpoint,
          finalError: error.message,
          statusCode: error.status_code
        });
      }

      return result;
    } catch (error) {
      // Handle unexpected errors (like network failures)
      if (attempt < maxAttempts) {
        const delay = calculateDelay(attempt, delayMs, backoffMultiplier);

        console.warn(
          `Unexpected API error (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms:`,
          {
            endpoint,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        );

        // Wait before retrying
        await sleep(delay);

        // Retry the request
        return this.fetchWithRetry<T>(endpoint, options, tags, attempt + 1);
      }

      // If we've exhausted attempts, create a proper ApiError and return it
      const apiError = createApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      );

      if (attempt > 1) {
        console.error(`API request failed after ${attempt} attempts due to unexpected error:`, {
          endpoint,
          finalError: apiError.message
        });
      }

      return err(apiError);
    }
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

    // Set up timeout using AbortController
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined;

    if (this.config.timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, this.config.timeout);
    }

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
      headers,
      signal: controller.signal
    };

    // Add caching for GET requests with optional tags
    if ((options.method === 'GET' || !options.method) && tags) {
      fetchOptions.next = {
        tags
      };
    }

    try {
      const response = await fetch(url, fetchOptions);

      // Clear timeout if request completed successfully
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

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
      // Clear timeout if request failed
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Handle network errors or other unexpected errors
      let apiError: ApiError;

      if (error instanceof Error && error.name === 'AbortError') {
        // Handle timeout specifically
        apiError = createApiError('Request timeout', 408);
      } else {
        apiError = createApiError(
          error instanceof Error ? error.message : 'Network error occurred',
          error instanceof Error && 'status' in error ? (error as any).status : undefined
        );
      }

      console.error('API Error:', apiError);

      // Send network error to Sentry with context
      Sentry.captureException(
        error instanceof Error ? error : new Error('Network error occurred'),
        {
          tags: {
            component: 'api-client',
            endpoint: endpoint,
            method: options.method || 'GET',
            error_type:
              error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network_error'
          },
          extra: {
            url,
            apiError,
            requestHeaders: Object.fromEntries(headers.entries()),
            originalError: error,
            timeout: this.config.timeout
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
    return this.fetchWithRetry<T>(`${endpoint}${queryString}`, { method: 'GET' }, tags);
  }

  async post<T>(endpoint: string, data?: any): Promise<Result<ApiResponse<T>, ApiError>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.fetchWithRetry<T>(endpoint, {
      method: 'POST',
      body
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'DELETE'
    });
  }
}
