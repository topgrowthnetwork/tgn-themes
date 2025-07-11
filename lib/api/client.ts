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

// Helper function to parse error response
async function parseErrorResponse(response: Response): Promise<ApiError> {
  const errorText = await response.text();
  let errorData: any = {};

  try {
    errorData = JSON.parse(errorText);
  } catch {
    // If response is not JSON, use the text as message
    errorData = { message: errorText };
  }

  return createApiError(errorData.message || response.statusText, response.status, {
    errors: errorData.errors,
    ...errorData // Include any additional error properties
  });
}

// Helper function to handle network errors
function handleNetworkError(error: unknown, endpoint: string, method: string): ApiError {
  if (error instanceof Error && error.name === 'AbortError') {
    return createApiError('Request timeout', 408);
  }

  return createApiError(
    error instanceof Error ? error.message : 'Network error occurred',
    error instanceof Error && 'status' in error ? (error as any).status : undefined
  );
}

// Helper function to log error to Sentry
function logErrorToSentry(
  error: ApiError | Error,
  context: {
    url: string;
    endpoint: string;
    method: string;
    status?: number;
    statusText?: string;
    requestHeaders?: Record<string, string>;
    responseBody?: string;
    originalError?: unknown;
    timeout?: number;
  }
) {
  const isApiError = 'status_code' in error;
  const errorMessage = isApiError ? `API Error: ${error.message}` : error.message;

  Sentry.captureException(new Error(errorMessage), {
    tags: {
      component: 'api-client',
      endpoint: context.endpoint,
      method: context.method,
      status_code:
        context.status?.toString() || (isApiError ? error.status_code?.toString() : undefined),
      error_type: isApiError ? 'api_error' : 'network_error'
    },
    extra: {
      url: context.url,
      status: context.status,
      statusText: context.statusText,
      error: isApiError ? error : undefined,
      requestHeaders: context.requestHeaders,
      responseBody: context.responseBody,
      originalError: context.originalError,
      timeout: context.timeout
    },
    level: 'error'
  });
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
        maxAttempts: this.defaultRetryConfig.maxAttempts,
        delayMs: this.defaultRetryConfig.delayMs,
        backoffMultiplier: this.defaultRetryConfig.backoffMultiplier,
        retryableStatusCodes: this.defaultRetryConfig.retryableStatusCodes,
        retryableErrors: this.defaultRetryConfig.retryableErrors,
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
    // Safe to use since constructor guarantees all properties are defined
    const retryConfig = this.config.retry as Required<NonNullable<ApiConfig['retry']>>;

    const result = await this.fetch<T>(endpoint, options, tags);

    // If successful, return the result
    if (result.isOk()) {
      return result;
    }

    const error = result.error;

    // Check if we should retry this error
    if (
      attempt < retryConfig.maxAttempts &&
      isRetryableError(error, retryConfig.retryableStatusCodes, retryConfig.retryableErrors)
    ) {
      const delay = calculateDelay(attempt, retryConfig.delayMs, retryConfig.backoffMultiplier);

      console.warn(
        `API request failed (attempt ${attempt}/${retryConfig.maxAttempts}), retrying in ${delay}ms:`,
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
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    tags?: string[]
  ): Promise<Result<ApiResponse<T>, ApiError>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    // Build headers
    const headers = this.buildHeaders(options.headers as Record<string, string> | undefined);

    // Set up timeout
    const { controller, timeoutId } = this.setupTimeout();

    // Set Content-Type based on body type
    this.setContentType(headers, options.body || undefined);

    // Add tokens
    this.addTokens(headers);

    // Build fetch options
    const fetchOptions = this.buildFetchOptions(options, headers, controller.signal, tags);

    try {
      const response = await fetch(url, fetchOptions);
      this.clearTimeout(timeoutId);

      if (!response.ok) {
        return this.handleHttpError<T>(response, url, endpoint, method, headers);
      }

      const data = await response.json();
      return ok(data);
    } catch (error) {
      this.clearTimeout(timeoutId);
      return this.handleNetworkError<T>(error, url, endpoint, method, headers);
    }
  }

  private buildHeaders(customHeaders?: Record<string, string>): Headers {
    return new Headers({
      ...this.config.headers,
      'X-Language': this.config.language!,
      'X-CSRF-TOKEN': '',
      ...(customHeaders || {})
    });
  }

  private setupTimeout(): { controller: AbortController; timeoutId?: NodeJS.Timeout } {
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined;

    if (this.config.timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, this.config.timeout);
    }

    return { controller, timeoutId };
  }

  private clearTimeout(timeoutId?: NodeJS.Timeout): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  private setContentType(headers: Headers, body?: BodyInit): void {
    if (!body) return;

    if (body instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
    } else if (typeof body === 'string') {
      try {
        // Try to parse as JSON to determine if it's JSON
        JSON.parse(body);
        headers.set('Content-Type', 'application/json');
      } catch {
        // If it's not valid JSON, don't set Content-Type
      }
    }
  }

  private addTokens(headers: Headers): void {
    if (this.config.guestToken) {
      headers.set('X-Guest-Token', this.config.guestToken);
    }

    if (this.config.authToken) {
      headers.set('Authorization', `Bearer ${this.config.authToken}`);
    }
  }

  private buildFetchOptions(
    options: RequestInit,
    headers: Headers,
    signal: AbortSignal,
    tags?: string[]
  ): RequestInit {
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      signal
    };

    // Add caching for GET requests with optional tags
    if ((options.method === 'GET' || !options.method) && tags) {
      fetchOptions.next = { tags };
    }

    return fetchOptions;
  }

  private async handleHttpError<T>(
    response: Response,
    url: string,
    endpoint: string,
    method: string,
    headers: Headers
  ): Promise<Result<ApiResponse<T>, ApiError>> {
    const apiError = await parseErrorResponse(response);
    const errorText = await response.text();

    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      error: apiError
    });

    logErrorToSentry(apiError, {
      url,
      endpoint,
      method,
      status: response.status,
      statusText: response.statusText,
      requestHeaders: Object.fromEntries(headers.entries()),
      responseBody: errorText
    });

    return err(apiError);
  }

  private handleNetworkError<T>(
    error: unknown,
    url: string,
    endpoint: string,
    method: string,
    headers: Headers
  ): Result<ApiResponse<T>, ApiError> {
    const apiError = handleNetworkError(error, endpoint, method);

    console.error('API Error:', apiError);

    logErrorToSentry(error instanceof Error ? error : new Error('Network error occurred'), {
      url,
      endpoint,
      method,
      requestHeaders: Object.fromEntries(headers.entries()),
      originalError: error,
      timeout: this.config.timeout
    });

    return err(apiError);
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
