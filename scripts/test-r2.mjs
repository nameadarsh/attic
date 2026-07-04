import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Manual quick-load of .env for the test script
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

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ENDPOINT = process.env.R2_ENDPOINT;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET_NAME) {
  console.error("Missing R2 Environment Variables!");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function runTest() {
  const testKey = 'test-file.txt';
  const testContent = 'Hello from Cloudflare R2!';

  try {
    console.log(`[1] Uploading test file: ${testKey}...`);
    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
    }));
    console.log('✅ Upload successful.');

    console.log(`[2] Listing objects...`);
    const listRes = await s3Client.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME
    }));
    const found = listRes.Contents?.some(item => item.Key === testKey);
    if (found) {
      console.log('✅ List successful. Test file found in bucket.');
    } else {
      throw new Error('Test file not found in list response.');
    }

    console.log(`[3] Downloading test file...`);
    const getRes = await s3Client.send(new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey
    }));
    const downloadedText = await getRes.Body.transformToString();
    if (downloadedText === testContent) {
      console.log('✅ Download successful. Content matches.');
    } else {
      throw new Error('Downloaded content does not match.');
    }

    console.log(`[4] Deleting test file...`);
    await s3Client.send(new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey
    }));
    console.log('✅ Delete successful.');

    console.log('\n🚀 ALL PHASE 4 INTEGRATION TESTS PASSED!');
    
  } catch (error) {
    console.error('❌ Integration Test Failed:', error);
    process.exit(1);
  }
}

runTest();
