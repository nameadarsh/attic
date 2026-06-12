const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'content', 'works', 'visuals');
const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));

let images = 0;
let videos = 0;
let totalSize = 0;
let fileStats = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      images++;
    } else if (['.mp4', '.webm', '.mov'].includes(ext)) {
      videos++;
    }
    totalSize += stats.size;
    fileStats.push({ file, size: stats.size });
  }
}

fileStats.sort((a, b) => b.size - a.size);

console.log(`Images: ${images}`);
console.log(`Videos: ${videos}`);
console.log(`Total Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log('Largest Files:');
for (let i = 0; i < Math.min(10, fileStats.length); i++) {
  console.log(`${fileStats[i].file}: ${(fileStats[i].size / (1024 * 1024)).toFixed(2)} MB`);
}
