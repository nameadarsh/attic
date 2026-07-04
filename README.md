# ATTIC

A personal digital archive designed to feel like a private attic rather than a museum. A place for photographs, videos, poems, thoughts, and memories that were simply worth keeping.

## Project Overview

This is not a portfolio. It is a quiet corner of the internet where content is prioritized over interface, and personality over polish. The experience is designed to feel lived-in, warm, and discovered.

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production
```bash
npm run build
npm start
```

## Folder Structure

All content is fully co-located. The source of truth for all memories is the `content/` folder.

```text
├── content/              # The Attic
│   ├── works/            # Photographs and Videos (Falling Trees)
│   │   ├── visuals/      # (Local Staging) Upload via npm run r2:upload
│   │   └── descriptions/ # Only metadata files (.md). Stored in Git.
│   ├── poems/            # Poems (Phir Bhi)
│   └── journal/          # Journal Entries (Hero Kaun)
```

## Adding Content

The easiest way to add content is to use the `_skeleton.md` file found inside each folder.

### Adding A Photo or Video (Falling Trees)

1. **Local Uploads**: Drop your media into `content/works/visuals/`. 
2. **Cloudflare R2 Sync**: Run `npm run r2:upload`. This directly pushes your media to the private Cloudflare R2 bucket without bloating the Git repository.
3. **Metadata Generation**: Run `npm run generate` locally. This will automatically scan R2/Local folders and generate dummy `.md` descriptions in `content/works/descriptions/`. By default, they are set to `Published: 1`.
4. Edit the `.md` metadata file if you want to add a custom description or change rotation.
5. **Commit**: Only commit the `.md` file to Git! The actual images are safely in R2.
6. **Deploy**: Push to main. Vercel will build the site, read your `.md` files, and securely proxy the media from R2.

### Adding A Poem (Phir Bhi)

1. Navigate to the `content/poems/` folder.
2. Duplicate `_skeleton.md` and rename it (e.g., `my-poem.md`).
3. Edit `my-poem.md`:
   - Set `Title: Your Title`
   - Set `Published: 1`
   - Add your poem text below the metadata. Line breaks will be preserved.
4. Commit and push.

### Adding A Journal Entry (Hero Kaun)

1. Navigate to the `content/journal/` folder.
2. Upload any media for the entry (e.g., `delhi-trip.jpg`).
3. Duplicate `_skeleton.md` and rename it (e.g., `delhi-trip.md`).
4. Edit `delhi-trip.md`:
   - Set `Title: Your Title`
   - Set `Published: 1`
   - Set `Media: delhi-trip.jpg`
   - Add your journal text below the metadata.
5. Commit and push.

## Automatic Metadata Generation (GitHub Workflow)

*Note: The automatic GitHub Web UI workflow is currently transitioning to the R2 architecture. For now, it's recommended to upload Visuals locally via `npm run r2:upload`.*

If you add text content (Poems, Journals) directly through the GitHub Web UI, the GitHub Action will automatically run and commit formatting checks.

*No manual alignment is required.*

## Metadata Fields

- `Title`: The human-readable title of the piece.
- `Published`: Must be `1` or `true` for the item to appear on the site.
- `Highlight`: Set to `1` or `true` to display a small star next to the item.
- `Rotation`: (Visuals only) Rotate media. `0`, `90`, `180`, `270`.
- `Date`: (Journal only) Format `YYYY-MM-DD`.
- `Media`: (Journal only) Comma-separated list of media filenames in the same folder.

## Deployment

The project is deployed via Vercel. 
Any push to the main branch on GitHub will automatically trigger a production build and deploy to `attic.adarshbajpai.com`. 

**Cloudflare R2 Integration**: Media assets are stored privately in Cloudflare R2. Vercel securely proxies these assets via `/api/media/[slug]` to prevent exposing your R2 credentials or raw bucket URLs. Ensure your Vercel project has the `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_ENDPOINT` environment variables.

## Troubleshooting & Common Mistakes

**"I uploaded a photo but it's not appearing!"**
1. **Check Published Status**: Did you set `Published: 1` in the `.md` file? By default, the auto-generator sets it to `0`.
2. **Check Filenames**: The `.jpg` and `.md` must have the exact same base name. `NightSky.jpg` and `nightsky.md` will NOT link together due to casing differences.
3. **Check Extensions**: The system only supports web-safe formats (`.jpg`, `.jpeg`, `.png`, `.webp`, `.mp4`, `.gif`). **RAW images (`.dng`) and iPhone HEIC files are explicitly NOT supported** because web browsers cannot render them natively. Please convert your files before uploading.

---
"Be kind."
