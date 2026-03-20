// API Error Handling Utility
// lib/utils/api-response.ts

export class APIError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Generic API response builder
 */
export const createSuccessResponse = <T>(data: T): APIResponse<T> => ({
  success: true,
  data,
});

/**
 * API error response builder
 */
export const createErrorResponse = (code: string, message: string): APIResponse => ({
  success: false,
  error: {
    code,
    message,
  },
});

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_EXISTS: 'USER_EXISTS',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Database
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',

  // Subscription
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  PLAN_CHANGE_FAILED: 'PLAN_CHANGE_FAILED',

  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
};

/**
 * HTTP status code mapping
 */
export const getHttpStatus = (code: string): number => {
  const mapping: Record<string, number> = {
    // 4xx
    [ErrorCodes.INVALID_CREDENTIALS]: 401,
    [ErrorCodes.UNAUTHORIZED]: 401,
    [ErrorCodes.FORBIDDEN]: 403,
    [ErrorCodes.USER_EXISTS]: 409,
    [ErrorCodes.ACCOUNT_SUSPENDED]: 403,
    [ErrorCodes.VALIDATION_ERROR]: 400,
    [ErrorCodes.INVALID_INPUT]: 400,
    [ErrorCodes.USER_NOT_FOUND]: 404,
    [ErrorCodes.RECORD_NOT_FOUND]: 404,
    [ErrorCodes.DUPLICATE_RECORD]: 409,
    [ErrorCodes.SUBSCRIPTION_NOT_FOUND]: 404,
    // 5xx
    [ErrorCodes.INTERNAL_SERVER_ERROR]: 500,
    [ErrorCodes.DATABASE_ERROR]: 500,
    [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 502,
  };
  return mapping[code] || 500;
};
