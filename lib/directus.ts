import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_STATIC_TOKEN;

// Instead of throwing when config is missing, we create a safe fallback client
// so the app can still run without Directus configured.
if (!directusUrl) {
  console.warn(
    '[Directus] NEXT_PUBLIC_DIRECTUS_URL is not defined. Directus data will not be loaded.'
  );
}

if (!directusToken || directusToken === 'your-static-token-here') {
  console.warn('DIRECTUS_STATIC_TOKEN is not set or is using placeholder value');
}

// Remove trailing slash from URL when defined
const cleanUrl = directusUrl ? directusUrl.replace(/\/$/, '') : null;

// If Directus is configured, create a real client, otherwise a noop client
const directus = cleanUrl
  ? createDirectus<Schema>(cleanUrl)
      .with(rest())
      .with(staticToken(directusToken || ''))
  : ({
      // Minimal interface used in lib/data.ts – always rejects requests
      request: async () => {
        throw new Error(
          '[Directus] Client is not configured. Please set NEXT_PUBLIC_DIRECTUS_URL and DIRECTUS_STATIC_TOKEN.'
        );
      },
    } as any);

export default directus;

// Helper function to get file URL
export function getFileUrl(
  fileId: string | { id: string } | null | undefined
): string | null {
  if (!fileId || !process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;
  
  // If it's already a URL string, return it
  if (typeof fileId === 'string' && (fileId.startsWith('http') || fileId.startsWith('/'))) {
    return fileId;
  }
  
  // Handle both string ID and file object
  const id = typeof fileId === 'string' ? fileId : fileId.id;
  if (!id) return null;
  
  const cleanUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL.replace(/\/$/, '');
  return `${cleanUrl}/assets/${id}`;
}

// Re-export health check functions
export { checkDirectusConnection, getDirectusHealthStatus } from './directus-health';

