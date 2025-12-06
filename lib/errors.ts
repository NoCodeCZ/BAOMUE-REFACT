export interface DirectusErrorInfo {
  message: string;
  status?: number;
  errors?: any[];
  isDirectusError: boolean;
}

/**
 * Type guard to check if error is a Directus error
 */
function isDirectusError(error: unknown): error is {
  message: string;
  status?: number;
  errors?: any[];
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Extract error information from Directus errors
 */
export function extractDirectusError(error: unknown): DirectusErrorInfo {
  if (isDirectusError(error)) {
    return {
      message: error.message || 'Directus error occurred',
      status: error.status,
      errors: error.errors,
      isDirectusError: true,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isDirectusError: false,
    };
  }

  return {
    message: 'Unknown error occurred',
    isDirectusError: false,
  };
}

/**
 * Log error with context
 */
export function logDirectusError(
  context: string,
  error: unknown
): void {
  const errorInfo = extractDirectusError(error);
  console.error(`[Directus Error] ${context}:`, {
    message: errorInfo.message,
    status: errorInfo.status,
    errors: errorInfo.errors,
  });
}

