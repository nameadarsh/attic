# Media Reintroduction Strategy

Now that the media has been backed up and the site safely deploys with an empty `visuals/` directory, we need to introduce the media back slowly. The goal is to identify if a specific file or sheer quantity is causing timeouts on Vercel or Git LFS bottlenecks.

## Prerequisites
- All media files are currently located in the `backup_media/` directory at the project root.
- The `content/works/visuals/` directory is currently empty.
- Your Next.js static builds are confirmed working.

## Process Overview

You will move files in **3 batches** from the `backup_media/` folder back into the `content/works/visuals/` folder.

After each batch, you must:
1. Commit the changes to Git.
2. Push to your repository (triggering Vercel).
3. Verify the Vercel deployment completes successfully.

---

## Batch 1: Small Verification (3-5 Images)

**Goal:** Prove the full pipeline (Git LFS -> Vercel -> Next.js Image Optimization) works for a minimal set.

1. Pick 3-5 `.jpg` or `.png` files from `backup_media/`.
2. Move them to `content/works/visuals/`.
   ```bash
   # Example:
   mv backup_media/IMG20250329223542.jpg content/works/visuals/
   ```
3. Commit and push.
4. Verify Vercel deployment.

---

## Batch 2: Scaling (10-20 Images)

**Goal:** Test Next.js build time with multiple files to ensure it's not a general volume issue.

1. Pick 10-20 more images from `backup_media/`.
2. Move them to `content/works/visuals/`.
3. Commit and push.
4. Verify Vercel deployment.

---

## Batch 3: Remaining Media & Large Videos

**Goal:** Reintroduce the remaining files while keeping an eye out for files over 100MB.

> [!WARNING]
> Your `backup_media/` folder contains several videos exceeding 100MB (e.g., `VID20250328131710.mp4` at ~226MB). Vercel has strict build size and time limits on free/pro tiers.

1. Introduce all remaining **images**. Commit, push, and verify.
2. Introduce **videos under 50MB**. Commit, push, and verify.
3. Finally, introduce **videos over 100MB** one by one or in very small sets. If Vercel times out here, you have identified the culprit.

If a large video causes a failure, you will need to compress it (e.g., using `ffmpeg` or Handbrake) to a smaller size or host it externally (like YouTube/Vimeo/S3) and reference it.

---

## Technical Note: Metadata Integrity

You do **not** need to touch the `.md` files in `content/works/descriptions/`. 

The system automatically matches media files to description files dynamically based on the filename (without extension). When you drop `VN20231028_230435.mp4` back into `visuals/`, the code will automatically link it to `VN20231028_230435.md` without any manual changes.
