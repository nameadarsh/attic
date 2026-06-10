import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { VisualMetadata, PoemMetadata, JournalMetadata } from '@/types';

const CONTENT_PATH = path.join(process.cwd(), 'content');
const MEDIA_PATH = path.join(process.cwd(), 'public', 'media');
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
 * Gets all visuals (images/videos) with their metadata
 */
export function getAllVisuals(): VisualMetadata[] {
  const descriptionsDir = path.join(WORKS_CONTENT_PATH, 'descriptions');
  const visualsDir = path.join(WORKS_CONTENT_PATH, 'visuals');

  if (!fs.existsSync(descriptionsDir) || !fs.existsSync(visualsDir)) return [];

  const files = fs.readdirSync(descriptionsDir).filter(f => !f.startsWith('_') && (f.endsWith('.md') || f.endsWith('.txt')));
  
  const visuals = files.map(file => {
    const contentData = getFileContent('works/descriptions', file);
    if (!contentData) return null;
    
    const { data, content } = contentData;
    const baseName = path.parse(file).name;
    // Find corresponding media file in the visuals directory
    const allFiles = fs.readdirSync(visualsDir);
    const mediaFile = allFiles.find(m => 
      path.parse(m).name === baseName && 
      /\.(jpg|jpeg|png|webp|mp4|gif)$/i.test(m)
    );
    
    if (!mediaFile) return null; // Filter out if no media exists

    const type = mediaFile.toLowerCase().endsWith('.mp4') ? 'video' : 'image';

    return {
      title: data.title || baseName,
      published: data.published ?? false,
      highlight: data.highlight ?? false,
      slug: slugify(data.title || baseName),
      description: content,
      filename: mediaFile,
      type: type as 'image' | 'video',
      rotation: data.rotation ?? 0
    } as VisualMetadata;
  }).filter((v): v is VisualMetadata => v !== null && v.published);

  return ensureUniqueSlugs(visuals);
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
  
  const poemDir = path.join(CONTENT_PATH, 'poems');
  if (!fs.existsSync(poemDir)) return [];
  
  let files: string[] = [];
  try {
    files = fs.readdirSync(poemDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  } catch (e) {
    console.error('Failed to read poems directory', e);
    return [];
  }
  
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

  return ensureUniqueSlugs(poems);
}

/**
 * Gets all journal entries
 */
export function getAllJournalEntries(): JournalMetadata[] {
  
  const journalDir = path.join(CONTENT_PATH, 'journal');
  if (!fs.existsSync(journalDir)) return [];
  
  let files: string[] = [];
  try {
    files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  } catch (e) {
    console.error('Failed to read journal directory', e);
    return [];
  }
  
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

  return ensureUniqueSlugs(entries);
}
