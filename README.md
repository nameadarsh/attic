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
│   │   ├── visuals/      # Only media files (.jpg, .mp4)
│   │   └── descriptions/ # Only metadata files (.md)
│   ├── poems/            # Poems (Phir Bhi)
│   └── journal/          # Journal Entries (Hero Kaun)
```

## Adding Content

The easiest way to add content is to use the `_skeleton.md` file found inside each folder.

### Adding A Photo or Video (Falling Trees)

1. Upload your media file (e.g., `my-photo.jpg`) to the `content/works/visuals/` folder.
2. Metadata appears automatically. (If adding locally, run `npm run generate`. If uploading via GitHub web, it will be generated within 30 seconds).
3. Open the newly generated `my-photo.md` inside `content/works/descriptions/` and edit the metadata (set `Published: 1`, add description).
4. Commit your changes.
5. Content appears on the site!

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

If you are uploading from a mobile device or quickly adding a photo directly through the GitHub Web UI without creating the `.md` file, the attic will help you:

1. Upload your photo (e.g., `sunset.jpg`) to `content/works/visuals/` and commit.
2. Within 30 seconds, a GitHub Action will run in the background.
3. It will automatically generate `sunset.md` inside `content/works/descriptions/` with default metadata (`Published: 0`) and commit it to your repository.
4. You can then edit `sunset.md` in the GitHub UI, set `Published: 1`, write your description, and save.

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

During the build step, the system securely synchronizes the co-located media to the static folder. No runtime API calls or backend infrastructure is used.

## Troubleshooting & Common Mistakes

**"I uploaded a photo but it's not appearing!"**
1. **Check Published Status**: Did you set `Published: 1` in the `.md` file? By default, the auto-generator sets it to `0`.
2. **Check Filenames**: The `.jpg` and `.md` must have the exact same base name. `NightSky.jpg` and `nightsky.md` will NOT link together due to casing differences.
3. **Check Extensions**: The system only supports web-safe formats (`.jpg`, `.jpeg`, `.png`, `.webp`, `.mp4`, `.gif`). **RAW images (`.dng`) and iPhone HEIC files are explicitly NOT supported** because web browsers cannot render them natively. Please convert your files before uploading.

---
"Be kind."
