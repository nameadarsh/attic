# ATTIC — Project Specification

## Project Overview

This project is not a portfolio.

This project is not a showcase.

This project is not intended to present the best version of its owner.

This project is a personal attic.

A place for photographs, videos, poems, sketches, thoughts, journals, and memories that were simply worth keeping.

The experience should feel like wandering through somebody's private archive.

Visitors should leave with the feeling:

"I spent a few minutes inside someone else's attic."

The website should never feel AI-generated, template-generated, SaaS-like, portfolio-like, startup-like, or over-optimized.

Avoid:

* Generic portfolio layouts
* Hero gradients
* Floating blob backgrounds
* Overuse of glassmorphism
* Excessive card designs
* Generic AI-generated animations
* Generic "creative developer" aesthetics

Every design decision should prioritize personality over polish.

---

# Development Rules

## Rule 1

This specification file is the source of truth.

All future development must follow this specification unless explicitly overridden by the project owner.

## Rule 2

Create a DEVELOPMENT_LOG.md file during Phase 1.

Every completed task must be logged.

Every new phase must review:

* ATTIC_SPECIFICATION.md
* DEVELOPMENT_LOG.md

before continuing.

## Rule 3

Never redesign features without checking specification.

Implement first.

Improve second.

## Rule 4

The project must remain GitHub-content-driven.

No external database.

No CMS.

No authentication.

No admin dashboard.

No backend persistence.

All content comes from repository files.

---

# Technology Stack

Preferred Stack:

* Next.js
* TypeScript
* TailwindCSS
* Framer Motion
* Vercel

The stack may be adjusted if a better implementation exists, but functionality and design philosophy must remain unchanged.

---

# Domain Structure

Main domain:

attic.adarshbajpai.com

Routes:

/
/visuals
/poems
/hero-kaun

Potential future route:

/colophon

---

# Content System

All content comes from repository files.

Supported formats:

* .txt
* .md

Both formats must be supported everywhere.

Markdown formatting is optional.

Plain text should work perfectly.

---

# Repository Structure

repo/

media/

content/
├── works/
├── poems/
├── journal/

journal_media/

templates/

ATTIC_SPECIFICATION.md
DEVELOPMENT_LOG.md

---

# Content Types

## Visuals

Media stored in:

media/

Supported:

* jpg
* jpeg
* png
* webp
* mp4

Metadata file:

content/works/

Required fields:

title:
published:
highlight:

Body:

description

Example:

Title: Last Train
Published: 1
Highlight: 0

The station was almost empty.

Automatic fields:

slug
type
filename

These should be generated automatically.

Not manually maintained.

---

## Poems

Stored in:

content/poems/

Required fields:

title:
published:
highlight:

Body:

poem content

Example:

Title: Aakhri Mulakat
Published: 1
Highlight: 1

Poem text...

---

## Hero Kaun (Journal)

Stored in:

content/journal/

Required fields:

title:
date:
published:
highlight:

media:

Body:

journal content

Example:

Title: Delhi Trip
Date: 2026-06-08
Published: 1
Highlight: 0

Media:

* train.jpg
* station.mp4

Journal text...

Media files stored in:

journal_media/

Use filenames.

Never use URLs.

The frontend resolves filenames automatically.

---

# Missing Metadata Behavior

If a media file exists without metadata:

Automatically generate metadata template.

Default values:

Title: filename
Published: 0
Highlight: 0

This ensures low-friction uploads.

---

# Homepage

Theme:

Dark
Minimal
Warm

No distracting backgrounds.

No decorative animations.

No hero blobs.

No trendy AI-generated aesthetics.

---

# Landing Hero

Centered.

Text:

"A personal attic, not a museum."

Small text below:

"Poems, photographs, videos and thoughts.
Things I wanted to keep."

Small personal introduction beneath.

No dedicated About page.

---

# Homepage Scroll Behavior

Upon landing:

Only hero visible.

Sections should not be visible immediately.

Small amount of scrolling reveals sections.

Avoid excessive empty space.

Avoid giant hero sections.

---

# Homepage Sections

Order:

Visuals
Poems
Hero Kaun

Each section displays:

* 2 newest items
* 1 highlighted item (if available)
* See All card

Section titles are clickable.

Section titles have hover interaction.

Horizontal scrolling layout.

---

# Shared Navigation

All pages share same navbar.

Items:

Home
Visuals
Poems
Hero Kaun

Navbar style:

Floating
Rounded
Semi-translucent

Inspired by premium editorial websites.

Not SaaS dashboards.

Not portfolio navigation.

---

# Visuals Page

Theme:

Dark
Cinematic
Quiet

Purpose:

Content first.
Interface second.

Visuals and videos share one feed.

No separate categories.

Chronological order.

Newest first.

Highlight items display a subtle star.

---

# Visuals Hover

On hover:

Dark vignette overlay.

Display:

Title
Description

Only these two fields.

No metadata clutter.

---

# Visual Viewer

Opening content should not navigate away.

Use modal viewer.

Background darkens.

Viewer remains fixed size.

Do not resize modal to content.

Excess space should use solid background.

Top-right controls:

Zoom In
Zoom Out
Info
Share
Close

Info:

Expands description panel.

Click elsewhere closes panel.

Share:

Copies direct content URL.

URL should update for deep-linking.

Example:

/visuals/last-train

Back button should work.

---

# Video Behavior

Initial page load:

Load images.

Load video thumbnails.

After thumbnails finish:

Start autoplay videos.

Videos:

Muted
Looping
Autoplay

Use lazy loading.

Prioritize perceived performance.

When opened:

Provide standard controls:

* timeline
* seek
* volume
* fullscreen

---

# Poems Page

Theme:

Warm
Book-like
Quiet

Do NOT use:

* handwriting fonts
* paper textures
* scrapbook effects

Use:

* comfortable serif typography
* generous spacing
* calm reading experience

---

# Poem Listing

Display preview cards.

Not full poems.

Preview truncates naturally.

Opening poem:

Modal.

Not separate page.

Modal larger than preview.

Scrollable if needed.

Close:

X button
or outside click

---

# Hero Kaun Page

Theme:

Retro terminal

NOT hacker aesthetic.

NOT Matrix aesthetic.

Reference:

Old personal computers.

Old text terminals.

Black background.

Subtle terminal-inspired typography.

Refined and readable.

---

# Journal Listing

Card-based layout.

Entries display:

Title
Date
Preview

Not full content.

---

# Journal Reading Experience

Explore page-turning concepts.

Aim for:

Reading somebody's stored memories.

Avoid gimmicks.

Keep interaction tasteful.

---

# Responsive Design

Entire site must be fully responsive.

Design must adapt gracefully to:

* mobile
* tablet
* desktop
* ultra-wide displays

Visual quality must not degrade.

Layouts should adapt without compromising experience.

---

# Animations

Animations should feel intentional.

No flashy motion.

No trendy effects.

Preferred feeling:

Opening a drawer.
Pulling out a notebook.
Viewing something stored away.

Small delays are acceptable.

Everything should feel deliberate.

---

# Footer

Homepage footer:

"This wasn't made to impress anyone.

It's just a place I wanted to exist.

You're welcome to stay.

You're welcome to leave.

Have a good life."

Below:

"Be kind."

Large.
Centered.
Plenty of whitespace.

---

# Hidden Colophon

Small subtle link in footer.

Very low visual weight.

When clicked:

Opens hidden page.

Route:

/colophon

Owner will provide final text later.

Current placeholder:

"If you've come this deep into the attic, you're either someone I care about or someone unusually curious.

Either way, it's nice to know you were here."

---

# Development Phases

## Phase 1

Project Setup

Tasks:

* Create repository structure
* Create ATTIC_SPECIFICATION.md
* Create DEVELOPMENT_LOG.md
* Configure routing
* Configure content loading system
* Configure txt/md parser
* Create template system

Update DEVELOPMENT_LOG.md

---

## Phase 2

Content Engine

Tasks:

* File discovery
* Automatic metadata generation
* Content parsing
* Slug generation
* Highlight support
* Published filtering

Update DEVELOPMENT_LOG.md

---

## Phase 3

Homepage

Tasks:

* Hero
* Navigation
* Section previews
* Footer
* Responsive behavior

Update DEVELOPMENT_LOG.md

---

## Phase 4

Visuals

Tasks:

* Grid
* Hover behavior
* Video handling
* Modal viewer
* Sharing
* Deep links

Update DEVELOPMENT_LOG.md

---

## Phase 5

Poems

Tasks:

* Listing
* Modal reader
* Theme implementation
* Responsive behavior

Update DEVELOPMENT_LOG.md

---

## Phase 6

Hero Kaun

Tasks:

* Listing
* Reading experience
* Terminal theme
* Journal media support

Update DEVELOPMENT_LOG.md

---

## Phase 7

Polish

Tasks:

* Animation pass
* Performance pass
* Accessibility pass
* Responsive pass
* Design consistency pass

Update DEVELOPMENT_LOG.md

---

## Phase 8

Final Review

Compare implementation against:

ATTIC_SPECIFICATION.md

and

DEVELOPMENT_LOG.md

List:

* completed items
* deviations
* intentional improvements
* unresolved issues

before declaring project complete.


# Design Philosophy

If a design choice is not explicitly specified, choose the option that makes the website feel more personal, quieter, and less portfolio-like.

The goal is not to impress visitors.

The goal is to make them feel like they discovered a place that already existed before they arrived.

When uncertain between multiple implementations:

- Prefer warmth over polish
- Prefer personality over optimization
- Prefer restraint over decoration
- Prefer timelessness over trends
- Prefer content over interface

The website should feel lived-in, not showcased.

Every section should feel like a different room inside the same attic.
