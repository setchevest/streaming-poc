/**
 * API Configuration
 * Centralized configuration for API URL and client settings
 */

/**
 * Get the API base URL from environment variable
 * This is the ONLY place where NEXT_PUBLIC_API_URL should be accessed
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

/**
 * API base URL - use this constant throughout the application
 */
export const API_URL = getApiUrl();
