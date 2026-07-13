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
 * Uses the public R2 dev URL if available for speed, otherwise falls back to Vercel API proxy.
 */
export function getMediaUrl(filename: string): string {
  const safeFilename = sanitizeMediaFilename(filename);
  const r2Url = process.env.NEXT_PUBLIC_R2_URL;
  
  if (r2Url) {
    // Trim trailing slash if present
    const baseUrl = r2Url.replace(/\/$/, '');
    return `${baseUrl}/works/visuals/${safeFilename}`;
  }
  
  // Fallback to proxy
  return `/api/media/works/visuals/${safeFilename}`;
}

/**
 * Returns the Next.js optimized URL path for a media file.
 * If using the direct R2 dev URL, we bypass Next.js image optimization 
 * to save compute since R2 serves fast directly.
 */
export function getOptimizedMediaUrl(filename: string, width: number = 1080, quality: number = 50): string {
  const mediaUrl = getMediaUrl(filename);
  
  // If we are using the direct R2 URL, skip Next.js optimization proxy as it can time out for large files
  if (process.env.NEXT_PUBLIC_R2_URL) {
    return mediaUrl;
  }
  
  // Next.js _next/image requires the target URL to be URI encoded
  return `/_next/image?url=${encodeURIComponent(mediaUrl)}&w=${width}&q=${quality}`;
}

/**
 * Returns the URL path for a journal media file.
 */
export function getJournalMediaUrl(filename: string): string {
  const r2Url = process.env.NEXT_PUBLIC_R2_URL;
  
  if (r2Url) {
    const baseUrl = r2Url.replace(/\/$/, '');
    return `${baseUrl}/journal/${filename}`;
  }
  
  return `/api/media/journal/${filename}`;
}
