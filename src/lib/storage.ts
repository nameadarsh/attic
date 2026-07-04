import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize the S3 client for Cloudflare R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT;

let s3Client: S3Client | null = null;

if (R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ENDPOINT) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

function ensureClient() {
  if (!s3Client) {
    throw new Error('Cloudflare R2 client is not configured. Missing environment variables.');
  }
  return s3Client;
}

function ensureBucket() {
  if (!R2_BUCKET_NAME) {
    throw new Error('Cloudflare R2 bucket name is not configured. Missing R2_BUCKET_NAME.');
  }
  return R2_BUCKET_NAME;
}

// -----------------------------------------------------------------------------
// Storage Interface (Phase 2)
// -----------------------------------------------------------------------------

/**
 * Uploads an object to the storage layer.
 * @param key The destination path/filename (e.g., 'poems/my-poem.md')
 * @param body The file content (Buffer, string, or stream)
 * @param contentType The MIME type of the file
 */
export async function uploadObject(key: string, body: Buffer | Uint8Array | string, contentType?: string) {
  const client = ensureClient();
  const bucket = ensureBucket();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);
  return key;
}

/**
 * Retrieves an object from the storage layer.
 * @param key The path/filename
 * @returns The object data as a string (ideal for text/markdown files)
 */
export async function getObjectString(key: string): Promise<string | null> {
  const client = ensureClient();
  const bucket = ensureBucket();

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    const response = await client.send(command);
    if (!response.Body) return null;
    
    return await response.Body.transformToString();
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Retrieves an object stream from the storage layer.
 * Ideal for proxying media files (images, videos) without loading them into memory.
 * @param key The path/filename
 */
export async function getObjectStream(key: string) {
  const client = ensureClient();
  const bucket = ensureBucket();

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    const response = await client.send(command);
    
    // AWS SDK v3 in Node.js returns a Readable (which conforms to AsyncIterable).
    // In Next.js Edge Runtime, it returns a Web ReadableStream. 
    // We can cast it as Web ReadableStream for standard Response objects.
    const stream = response.Body?.transformToWebStream();
    
    return {
      stream,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      eTag: response.ETag,
    };
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Generates a short-lived presigned URL for secure frontend access without exposing credentials.
 * Use this only if strict proxying is not required and direct (but temporary) R2 CDN access is acceptable.
 * @param key The path/filename
 * @param expiresIn Seconds until URL expires (default 1 hour)
 */
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = ensureClient();
  const bucket = ensureBucket();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Deletes an object from the storage layer.
 * @param key The path/filename
 */
export async function deleteObject(key: string) {
  const client = ensureClient();
  const bucket = ensureBucket();

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Lists objects in a specific directory prefix.
 * @param prefix The directory path (e.g., 'poems/')
 */
export async function listObjects(prefix?: string) {
  const client = ensureClient();
  const bucket = ensureBucket();

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const response = await client.send(command);
  return response.Contents?.map(item => item.Key!) || [];
}

// -----------------------------------------------------------------------------
// Domain-Specific Storage Interface Abstractions
// -----------------------------------------------------------------------------

export async function getPoems() {
  return listObjects('poems/');
}

export async function getPoem(slug: string) {
  return getObjectString(`poems/${slug}.md`);
}

export async function getJournalEntries() {
  return listObjects('journal/');
}

export async function getJournalEntry(slug: string) {
  return getObjectString(`journal/${slug}.md`);
}

export async function getImages() {
  // Only list files in visuals that are images
  const allVisuals = await listObjects('works/visuals/');
  return allVisuals.filter(key => /\.(jpg|jpeg|png|webp|gif)$/i.test(key));
}

export async function getImage(filename: string) {
  // Return the path or a pre-signed URL depending on architectural choice.
  // We'll return the object key for now to let the application route it.
  return `works/visuals/${filename}`;
}

export async function getVideos() {
  const allVisuals = await listObjects('works/visuals/');
  return allVisuals.filter(key => /\.(mp4|webm)$/i.test(key));
}
