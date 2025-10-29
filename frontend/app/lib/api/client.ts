/**
 * API Client
 * Centralized API client for making HTTP requests
 * Works on both client and server side (Next.js compatible)
 */

import { API_URL } from './config';

export interface ApiError {
  message: string;
  status?: number;
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Make a GET request to the API
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options including params for query string
 */
export async function apiGet<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    ...options,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Failed to fetch ${endpoint}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

/**
 * Make a POST request to the API
 * @param endpoint - API endpoint (without base URL)
 * @param data - Data to send in request body
 * @param options - Additional fetch options
 */
export async function apiPost<T, D = any>(
  endpoint: string,
  data?: D,
  options?: FetchOptions
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Failed to post to ${endpoint}`,
      status: response.status,
    };

    // Try to get error message from response
    try {
      const errorData = await response.json();
      error.message = errorData.error || errorData.message || error.message;
    } catch {
      // If parsing fails, use default error message
    }

    throw error;
  }

  return response.json();
}

/**
 * Make a PUT request to the API
 * @param endpoint - API endpoint (without base URL)
 * @param data - Data to send in request body
 * @param options - Additional fetch options
 */
export async function apiPut<T, D = any>(
  endpoint: string,
  data?: D,
  options?: FetchOptions
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Failed to update ${endpoint}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

/**
 * Make a DELETE request to the API
 * @param endpoint - API endpoint (without base URL)
 * @param options - Additional fetch options
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const response = await fetch(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: `Failed to delete ${endpoint}`,
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

/**
 * Build full URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Default export for convenience
 */
export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};

export default apiClient;
