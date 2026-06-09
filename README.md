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

## Content System: Adding New Entries

The project is entirely content-driven from repository files. You can use either `.md` or `.txt` formats.

### 1. Visuals (Images & Videos)
- **Step 1:** Drop your media file (`.jpg`, `.png`, `.webp`, `.mp4`) into the `media/` directory.
- **Step 2:** Start the dev server. A metadata file with the same name will be automatically created in `content/works/`.
- **Step 3:** Edit the file in `content/works/` to add a description and set `Published: 1`.

**Format:**
```text
Title: My Photograph
Published: 1
Highlight: 0

The description of the moment goes here.
```

### 2. Poems
- **Step 1:** Create a new file in `content/poems/`.
- **Step 2:** Use the following format:

**Format:**
```text
Title: A Quiet Evening
Published: 1
Highlight: 1

Your poem text starts here.
Spacing and line breaks are preserved.
```

### 3. Hero Kaun (Journal)
- **Step 1:** Create a new file in `content/journal/`.
- **Step 2:** If you have media for the entry, put it in `journal_media/`.
- **Step 3:** Use the following format:

**Format:**
```text
Title: Trip to the Hills
Date: 2026-06-09
Published: 1
Highlight: 0
Media: hills.jpg, sunset.mp4

Your journal entry text goes here.
Media filenames should match the files in journal_media/.
```

## Project Structure

```text
├── content/              # All text-based content
│   ├── works/            # Visuals metadata
│   ├── poems/            # Poem entries
│   └── journal/          # Journal (Hero Kaun) entries
├── media/                # Images and videos for Visuals
├── journal_media/        # Images and videos for Journal entries
├── src/                  # Next.js application source
│   ├── app/              # Routes and pages
│   ├── components/       # UI components (Modals, Cards, Nav)
│   ├── lib/              # Content engine and utilities
│   └── types/            # TypeScript definitions
├── public/               # Static assets
├── ATTIC_SPECIFICATION.md # Project source of truth
└── DEVELOPMENT_LOG.md    # History of implementation
```

## Design Philosophy

- **Warmth over Polish:** Prefers a "lived-in" feel.
- **Restraint over Decoration:** Minimal animations, lots of whitespace.
- **Content over Interface:** The UI should disappear to let the memories speak.
- **Timelessness over Trends:** No trendy gradients, blobs, or "creative developer" tropes.

---
"Be kind."
