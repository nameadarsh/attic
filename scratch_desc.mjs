import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
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

async function listAll() {
  const command = new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, Prefix: 'works/descriptions/' });
  const response = await s3Client.send(command);
  const keys = response.Contents?.map(c => c.Key) || [];
  console.log('DESCRIPTIONS:', keys);
}

listAll().catch(console.error);
