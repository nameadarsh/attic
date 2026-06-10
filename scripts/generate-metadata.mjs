import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const WORKS_VISUALS = path.join(ROOT_DIR, 'content', 'works', 'visuals');
const WORKS_DESCRIPTIONS = path.join(ROOT_DIR, 'content', 'works', 'descriptions');
const JOURNAL_DIR = path.join(ROOT_DIR, 'content', 'journal');

const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.gif'];

function generateMissingMetadata() {
  console.log('Scanning for missing metadata...');
  
  // Ensure directories exist
  if (!fs.existsSync(WORKS_DESCRIPTIONS)) {
    fs.mkdirSync(WORKS_DESCRIPTIONS, { recursive: true });
  }
  if (!fs.existsSync(WORKS_VISUALS)) {
    fs.mkdirSync(WORKS_VISUALS, { recursive: true });
  }
  
  // 1. Generate for Works
  const workVisuals = fs.readdirSync(WORKS_VISUALS);
  let worksGenerated = 0;
  
  for (const file of workVisuals) {
    const ext = path.extname(file).toLowerCase();
    if (MEDIA_EXTS.includes(ext)) {
      const baseName = path.parse(file).name;
      const mdPath = path.join(WORKS_DESCRIPTIONS, `${baseName}.md`);
      const txtPath = path.join(WORKS_DESCRIPTIONS, `${baseName}.txt`);
      
      if (!fs.existsSync(mdPath) && !fs.existsSync(txtPath)) {
        console.log(`Generating metadata for works: ${file}`);
        const content = `Title: ${baseName}\nPublished: 0\nHighlight: 0\nRotation: 0\n\n[Description for ${baseName}]`;
        fs.writeFileSync(mdPath, content, 'utf8');
        worksGenerated++;
      }
    }
  }

  // 2. Generate for Journal
  if (fs.existsSync(JOURNAL_DIR)) {
    const journalFiles = fs.readdirSync(JOURNAL_DIR);
    let journalGenerated = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const file of journalFiles) {
      const ext = path.extname(file).toLowerCase();
      if (MEDIA_EXTS.includes(ext)) {
        const baseName = path.parse(file).name;
        const mdPath = path.join(JOURNAL_DIR, `${baseName}.md`);
        const txtPath = path.join(JOURNAL_DIR, `${baseName}.txt`);
        
        if (!fs.existsSync(mdPath) && !fs.existsSync(txtPath)) {
          console.log(`Generating metadata for journal: ${file}`);
          const content = `Title: ${baseName}\nDate: ${today}\nPublished: 0\nHighlight: 0\nMedia: ${file}\n\n[Journal entry for ${baseName}]`;
          fs.writeFileSync(mdPath, content, 'utf8');
          journalGenerated++;
        }
      }
    }
    console.log(`Generated ${journalGenerated} missing metadata files for journal.`);
  }

  console.log(`Generated ${worksGenerated} missing metadata files for works.`);
}

generateMissingMetadata();
