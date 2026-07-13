import matter from 'gray-matter';
import { VisualMetadata, PoemMetadata, JournalMetadata } from '@/types';
import { sanitizeMediaFilename } from './media';
import { listObjects, getObjectString, getImages, getVideos } from './storage';

/**
 * Slugifies a string for URL use
 */
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

/**
 * Parses content from a string, supporting both YAML frontmatter and custom "Key: Value" format
 */
export function parseContentString(fileContent: string) {
  const { data, content } = matter(fileContent);
  
  // If gray-matter didn't find frontmatter, use custom parser
  const finalData = Object.keys(data).length === 0 ? parseCustomFormat(fileContent).data : data;
  const finalContent = Object.keys(data).length === 0 ? parseCustomFormat(fileContent).content : content;

  return { data: finalData, content: finalContent };
}

function parseCustomFormat(fileContent: string) {
  const lines = fileContent.split('\n');
  const data: Record<string, any> = {};
  let bodyStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line && i === 0) continue; // Skip leading empty lines
    if (!line) {
      bodyStartIndex = i + 1;
      break;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      
      if (key === 'published' || key === 'highlight') {
        data[key] = value === '1' || value === 'true';
      } else if (key === 'media') {
        // Handle media as an array for journals
        data[key] = value.split(',').map(m => m.trim()).filter(Boolean);
      } else if (key === 'rotation') {
        data[key] = parseInt(value, 10) || 0;
      } else {
        data[key] = value;
      }
    } else {
      bodyStartIndex = i;
      break;
    }
  }

  const content = lines.slice(bodyStartIndex).join('\n').trim();
  return { data, content };
}

/**
 * Gets all visuals (images/videos) with their metadata from R2
 */
export async function getAllVisuals(): Promise<VisualMetadata[]> {
  try {
    const descriptionKeys = await listObjects('works/descriptions/');
    const r2Images = await getImages();
    const r2Videos = await getVideos();
    const allMediaKeys = [...r2Images, ...r2Videos];

    const visuals: VisualMetadata[] = [];

    for (const key of descriptionKeys) {
      if (!key.endsWith('.md') && !key.endsWith('.txt')) continue;
      if (key.includes('/_')) continue; // Skip templates/skeletons

      const fileContent = await getObjectString(key);
      if (!fileContent) continue;

      const { data, content } = parseContentString(fileContent);
      
      // key is something like "works/descriptions/my-photo.md"
      const baseName = key.split('/').pop()?.replace(/\.(md|txt)$/, '') || '';
      
      const sanitizedBase = sanitizeMediaFilename(baseName).split('.')[0];
      
      const matchedKey = allMediaKeys.find(mediaKey => {
        const keyBase = mediaKey.split('/').pop()?.split('.')[0] || '';
        return keyBase === sanitizedBase || keyBase === baseName.toLowerCase();
      });
      
      if (!matchedKey) continue; // Filter out if no media exists

      const type = matchedKey.toLowerCase().endsWith('.mp4') || matchedKey.toLowerCase().endsWith('.webm') ? 'video' : 'image';
      const mediaFilename = matchedKey.split('/').pop() || '';

      visuals.push({
        title: data.title || baseName,
        published: data.published ?? false,
        highlight: data.highlight ?? false,
        slug: slugify(data.title || baseName),
        description: content,
        filename: mediaFilename,
        type: type as 'image' | 'video',
        rotation: data.rotation ?? 0
      });
    }

    return ensureUniqueSlugs(visuals.filter(v => v.published));
  } catch (error) {
    console.error('Failed to fetch visuals from R2:', error);
    return [];
  }
}

function ensureUniqueSlugs<T extends { slug: string }>(items: T[]): T[] {
  const slugCounts = new Map<string, number>();
  return items.map(item => {
    let slug = item.slug;
    const count = slugCounts.get(slug) || 0;
    if (count > 0) {
      slug = `${slug}-${count}`;
    }
    slugCounts.set(item.slug, count + 1);
    return { ...item, slug };
  });
}

/**
 * Gets all poems from R2
 */
export async function getAllPoems(): Promise<PoemMetadata[]> {
  try {
    const keys = await listObjects('poems/');
    const poems: PoemMetadata[] = [];

    for (const key of keys) {
      if (!key.endsWith('.md') && !key.endsWith('.txt')) continue;
      if (key.includes('/_')) continue; // Skip templates/skeletons

      const fileContent = await getObjectString(key);
      if (!fileContent) continue;

      const { data, content } = parseContentString(fileContent);
      const baseName = key.split('/').pop()?.replace(/\.(md|txt)$/, '') || '';

      poems.push({
        title: data.title || baseName,
        published: data.published ?? false,
        highlight: data.highlight ?? false,
        slug: slugify(data.title || baseName),
        content: content
      });
    }

    return ensureUniqueSlugs(poems.filter(p => p.published));
  } catch (error) {
    console.error('Failed to fetch poems from R2:', error);
    return [];
  }
}

/**
 * Gets all journal entries from R2
 */
export async function getAllJournalEntries(): Promise<JournalMetadata[]> {
  try {
    const keys = await listObjects('journal/');
    const entries: JournalMetadata[] = [];

    for (const key of keys) {
      // Allow only metadata files, skip actual media in the root journal folder
      if (!key.endsWith('.md') && !key.endsWith('.txt')) continue;
      if (key.includes('/_')) continue; // Skip templates/skeletons

      const fileContent = await getObjectString(key);
      if (!fileContent) continue;

      const { data, content } = parseContentString(fileContent);
      const baseName = key.split('/').pop()?.replace(/\.(md|txt)$/, '') || '';

      entries.push({
        title: data.title || baseName,
        date: data.date || '',
        published: data.published ?? false,
        highlight: data.highlight ?? false,
        slug: slugify(data.title || baseName),
        media: data.media || [],
        content: content
      });
    }

    return ensureUniqueSlugs(entries.filter(j => j.published));
  } catch (error) {
    console.error('Failed to fetch journal entries from R2:', error);
    return [];
  }
}
