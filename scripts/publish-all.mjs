import fs from 'fs';
import path from 'path';

const worksDesc = path.join(process.cwd(), 'content', 'works', 'descriptions');
const files = fs.readdirSync(worksDesc).filter(f => f.endsWith('.md'));

let updated = 0;
for (const file of files) {
  const p = path.join(worksDesc, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('Published: 0')) {
    content = content.replace(/Published: 0/g, 'Published: 1');
    fs.writeFileSync(p, content);
    updated++;
  }
}
console.log(`Published ${updated} items.`);
