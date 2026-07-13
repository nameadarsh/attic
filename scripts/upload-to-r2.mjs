import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.gif'];

function sanitizeMediaFilename(filename) {
  const parts = filename.split('.');
  if (parts.length < 2) return filename.toLowerCase();
  
  const ext = parts.pop().toLowerCase();
  const name = parts.join('.');
  
  const sanitizedName = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
    
  return `${sanitizedName}.${ext}`;
}

function getContentType(ext) {
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

async function uploadDirectory(srcDir, prefix) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Directory not found: ${srcDir}`);
    return;
  }

  const files = fs.readdirSync(srcDir);
  console.log(`Found ${files.length} files in ${prefix}. Starting upload...`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!MEDIA_EXTS.includes(ext)) continue;

    const safeFilename = sanitizeMediaFilename(file);
    const key = `${prefix}/${safeFilename}`;
    const filePath = path.join(srcDir, file);
    const body = fs.readFileSync(filePath);

    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: getContentType(ext),
      }));
      console.log(`✅ Uploaded ${file} -> ${key}`);
    } catch (e) {
      console.error(`❌ Failed to upload ${file}:`, e);
    }
  }
}

async function uploadAll() {
  const visualsDir = path.join(process.cwd(), 'content', 'works', 'visuals');
  const journalDir = path.join(process.cwd(), 'content', 'journal');

  await uploadDirectory(visualsDir, 'works/visuals');
  await uploadDirectory(journalDir, 'journal');
}

uploadAll();
