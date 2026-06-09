export type ContentType = 'visuals' | 'poems' | 'journal';

export interface BaseMetadata {
  title: string;
  published: boolean;
  highlight: boolean;
  slug: string;
}

export interface VisualMetadata extends BaseMetadata {
  description: string;
  filename: string;
  type: 'image' | 'video';
  rotation: number;
}

export interface PoemMetadata extends BaseMetadata {
  content: string;
}

export interface JournalMetadata extends BaseMetadata {
  date: string;
  media: string[];
  content: string;
}
