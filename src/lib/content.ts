import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { VisualMetadata, PoemMetadata, JournalMetadata } from '@/types';

const CONTENT_PATH = path.join(process.cwd(), 'content');
const MEDIA_PATH = path.join(process.cwd(), 'media');
const WORKS_CONTENT_PATH = path.join(CONTENT_PATH, 'works');

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
 * Parses content from a file, supporting both YAML frontmatter and custom "Key: Value" format
 */
export function getFileContent(subDir: string, fileName: string) {
  const filePath = path.join(CONTENT_PATH, subDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
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
 * Ensures metadata exists for all media files in the media/ directory
 * If a media file exists without a corresponding metadata file in content/works/,
 * it creates one with default values.
 */
export function syncMediaMetadata() {
  if (!fs.existsSync(MEDIA_PATH)) return;
  if (!fs.existsSync(WORKS_CONTENT_PATH)) fs.mkdirSync(WORKS_CONTENT_PATH, { recursive: true });

  const mediaFiles = fs.readdirSync(MEDIA_PATH).filter(file => 
    /\.(jpg|jpeg|png|webp|mp4)$/i.test(file)
  );

  mediaFiles.forEach(mediaFile => {
    const baseName = path.parse(mediaFile).name;
    const metaFileName = `${baseName}.md`;
    const metaFilePath = path.join(WORKS_CONTENT_PATH, metaFileName);

    if (!fs.existsSync(metaFilePath)) {
      const defaultMetadata = `Title: ${baseName}\nPublished: 0\nHighlight: 0\n\n`;
      fs.writeFileSync(metaFilePath, defaultMetadata);
    }
  });
}

let visualsCache: VisualMetadata[] | null = null;
let poemsCache: PoemMetadata[] | null = null;
let journalCache: JournalMetadata[] | null = null;

/**
 * Gets all visuals (images/videos) with their metadata
 */
export function getAllVisuals(): VisualMetadata[] {
  if (visualsCache && process.env.NODE_ENV === 'production') return visualsCache;
  
  syncMediaMetadata();
  const files = fs.readdirSync(WORKS_CONTENT_PATH).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  
  const visuals = files.map(file => {
    const contentData = getFileContent('works', file);
    if (!contentData) return null;
    
    const { data, content } = contentData;
    const baseName = path.parse(file).name;
    
    // Find corresponding media file
    const mediaFiles = fs.readdirSync(MEDIA_PATH);
    const mediaFile = mediaFiles.find(m => path.parse(m).name === baseName);
    
    if (!mediaFile) return null; // Issue 1 Fix: Filter out if no media exists

    const type = mediaFile.toLowerCase().endsWith('.mp4') ? 'video' : 'image';

    return {
      title: data.title || baseName,
      published: data.published ?? false,
      highlight: data.highlight ?? false,
      slug: slugify(data.title || baseName),
      description: content,
      filename: mediaFile,
      type: type as 'image' | 'video'
    } as VisualMetadata;
  }).filter((v): v is VisualMetadata => v !== null && v.published);

  // Issue 2 Fix: Handle duplicate slugs
  visualsCache = ensureUniqueSlugs(visuals);
  return visualsCache;
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
 * Gets all poems
 */
export function getAllPoems(): PoemMetadata[] {
  if (poemsCache && process.env.NODE_ENV === 'production') return poemsCache;
  
  const poemDir = path.join(CONTENT_PATH, 'poems');
  if (!fs.existsSync(poemDir)) return [];
  
  const files = fs.readdirSync(poemDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  
  const poems = files.map(file => {
    const contentData = getFileContent('poems', file);
    if (!contentData) return null;
    
    const { data, content } = contentData;
    const baseName = path.parse(file).name;

    return {
      title: data.title || baseName,
      published: data.published ?? false,
      highlight: data.highlight ?? false,
      slug: slugify(data.title || baseName),
      content: content
    } as PoemMetadata;
  }).filter((p): p is PoemMetadata => p !== null && p.published);

  poemsCache = ensureUniqueSlugs(poems);
  return poemsCache;
}

/**
 * Gets all journal entries
 */
export function getAllJournalEntries(): JournalMetadata[] {
  if (journalCache && process.env.NODE_ENV === 'production') return journalCache;
  
  const journalDir = path.join(CONTENT_PATH, 'journal');
  if (!fs.existsSync(journalDir)) return [];
  
  const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  
  const entries = files.map(file => {
    const contentData = getFileContent('journal', file);
    if (!contentData) return null;
    
    const { data, content } = contentData;
    const baseName = path.parse(file).name;

    return {
      title: data.title || baseName,
      date: data.date || '',
      published: data.published ?? false,
      highlight: data.highlight ?? false,
      slug: slugify(data.title || baseName),
      media: data.media || [],
      content: content
    } as JournalMetadata;
  }).filter((j): j is JournalMetadata => j !== null && j.published);

  journalCache = ensureUniqueSlugs(entries);
  return journalCache;
}
