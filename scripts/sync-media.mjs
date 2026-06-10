import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const WORKS_SRC = path.join(ROOT_DIR, 'content', 'works', 'visuals');
const JOURNAL_SRC = path.join(ROOT_DIR, 'content', 'journal');
const WORKS_DEST = path.join(ROOT_DIR, 'public', 'media');
const JOURNAL_DEST = path.join(ROOT_DIR, 'public', 'journal_media');

const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.gif'];

function syncDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.log(`Source directory not found: ${srcDir}`);
    return;
  }
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Clear destination to ensure deleted files from src are removed from dest
  const existingFiles = fs.readdirSync(destDir);
  for (const file of existingFiles) {
    if (file === '.gitkeep') continue;
    fs.unlinkSync(path.join(destDir, file));
  }

  const files = fs.readdirSync(srcDir);
  let syncedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (MEDIA_EXTS.includes(ext)) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(srcPath, destPath);
      syncedCount++;
    }
  }

  console.log(`Synced ${syncedCount} media files to ${path.basename(destDir)}`);
}

console.log('Synchronizing media files for static build...');
syncDirectory(WORKS_SRC, WORKS_DEST);
syncDirectory(JOURNAL_SRC, JOURNAL_DEST);
console.log('Sync complete.');
