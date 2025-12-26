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
  // Only warn in development, not in production
  if (process.env.NODE_ENV === 'development') {
    console.warn('DIRECTUS_STATIC_TOKEN is not set or is using placeholder value');
  }
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
  if (!fileId) return null;
  
  // If it's already a URL string, return it
  if (typeof fileId === 'string' && (fileId.startsWith('http') || fileId.startsWith('/') || fileId.startsWith('data:'))) {
    return fileId;
  }
  
  // Check if Directus URL is configured
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getFileUrl] NEXT_PUBLIC_DIRECTUS_URL is not set. Cannot generate asset URL.');
    }
    return null;
  }
  
  // Handle both string ID and file object
  const id = typeof fileId === 'string' ? fileId : (fileId as any)?.id;
  if (!id) return null;
  
  // Validate UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getFileUrl] Invalid UUID format: ${id}`);
    }
    return null;
  }
  
  const cleanUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL.replace(/\/$/, '');
  
  // Use Next.js API route to proxy images with authentication
  // This avoids exposing tokens in URLs and handles CORS/auth issues
  // The API route will fetch from Directus with proper authentication
  return `/api/directus-assets/${id}`;
}

// Helper function to get Directus placeholder image URL
// Uses Directus asset URL format with a placeholder image UUID
// To use: Upload a placeholder image to Directus and set DIRECTUS_PLACEHOLDER_IMAGE_ID env variable
// If not set, falls back to a data URI SVG placeholder
export function getPlaceholderUrl(
  width: number = 400,
  height: number = 600,
  text?: string
): string | null {
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;
  
  const cleanUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL.replace(/\/$/, '');
  
  // Check if a placeholder image UUID is configured
  const placeholderFileId = process.env.DIRECTUS_PLACEHOLDER_IMAGE_ID;
  
  if (placeholderFileId) {
    // Use the placeholder image from Directus with transformations
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      fit: 'cover',
      quality: '80',
    });
    return `${cleanUrl}/assets/${placeholderFileId}?${params.toString()}`;
  }
  
  // Fallback: Generate an SVG data URI placeholder that matches the design
  // This creates a placeholder that looks like it's from Directus
  const bgColor = '#e5e7eb'; // slate-200
  const iconColor = '#9ca3af'; // slate-400
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bgColor}"/><circle cx="50%" cy="40%" r="40" fill="${iconColor}" opacity="0.5"/><rect x="calc(50% - 40px)" y="calc(60% - 10px)" width="80" height="20" fill="${iconColor}" opacity="0.5" rx="4"/></svg>`;
  
  // Use encodeURIComponent for browser compatibility (works in both Node.js and browser)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Re-export health check functions
export { checkDirectusConnection, getDirectusHealthStatus } from './directus-health';

