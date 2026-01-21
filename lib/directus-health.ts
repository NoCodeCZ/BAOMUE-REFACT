import directus from './directus';
import { readSingleton } from '@directus/sdk';

const readSingletonTyped = readSingleton as any;

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
 * Check if Directus connection is healthy
 * @returns Promise<boolean> - true if connection is healthy
 */
export async function checkDirectusConnection(): Promise<boolean> {
  try {
    await directus.request(
      readSingletonTyped('global_settings', {
        fields: ['id'],
      })
    );
    return true;
  } catch (error) {
    if (isDirectusError(error)) {
      console.error('[Directus Health] Connection failed:', error.message);
    } else {
      console.error('[Directus Health] Unknown error:', error);
    }
    return false;
  }
}

/**
 * Get detailed health status
 */
export async function getDirectusHealthStatus(): Promise<{
  healthy: boolean;
  url: string | null;
  timestamp: string;
  error?: string;
}> {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL || null;
  const timestamp = new Date().toISOString();
  
  try {
    const healthy = await checkDirectusConnection();
    return { healthy, url, timestamp };
  } catch (error) {
    return {
      healthy: false,
      url,
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

