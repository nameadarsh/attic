/**
 * Centralized utility for handling media path logic and URL generation.
 * This guarantees URL generation exactly matches the deployed file structure.
 */

/**
 * Normalizes and sanitizes a media filename.
 * Replaces spaces with hyphens, removes special characters, and lowercases.
 * IMPORTANT: This exact logic is duplicated in `scripts/sync-media.mjs`.
 * If you update it here, you MUST update it there.
 */
export function sanitizeMediaFilename(filename: string): string {
  // Extract extension to preserve it
  const parts = filename.split('.');
  if (parts.length < 2) return filename.toLowerCase();
  
  const ext = parts.pop()?.toLowerCase() || '';
  const name = parts.join('.');
  
  const sanitizedName = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
    
  return `${sanitizedName}.${ext}`;
}

/**
 * Returns the absolute unoptimized URL path for a media file.
 * Safely encodes the path for use in the browser.
 */
export function getMediaUrl(filename: string): string {
  const safeFilename = sanitizeMediaFilename(filename);
  return `/media/${safeFilename}`;
}

/**
 * Returns the Next.js optimized URL path for a media file.
 * This directly interfaces with Next.js' internal image optimization API.
 */
export function getOptimizedMediaUrl(filename: string, width: number = 1080, quality: number = 50): string {
  const mediaUrl = getMediaUrl(filename);
  // Next.js _next/image requires the target URL to be URI encoded
  return `/_next/image?url=${encodeURIComponent(mediaUrl)}&w=${width}&q=${quality}`;
}
