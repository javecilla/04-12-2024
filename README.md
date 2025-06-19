# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 04122024 Gallery SPA

A modern, mobile-friendly photo gallery web app built with Vue 3, TypeScript, Pinia, Vue Router, and Tailwind CSS.

## Features

- Album listing with cover photos
- Click an album to view all photos in a beautiful masonry layout
- Responsive and mobile-friendly
- Smooth SPA navigation
- Aesthetic color palette

## Color Palette

- **Primary:** `#fb5835`
- **Background:** `#ffffff`
- **Dark:** `#2c2c2c`

## Tech Stack

- Vue 3 + TypeScript
- Pinia (state management)
- Vue Router (SPA navigation)
- Tailwind CSS (utility-first styling)

## Folder Structure

```
public/images/
  albums-cover-photo/   # Album cover images (one per album, in a subfolder)
  photos-in-album/      # Photos for each album (subfolder per album)
```

## Adding Albums & Photos

1. Add a new folder in `public/images/albums-cover-photo/` for the album, and place a cover image inside.
2. Add a folder with the same name in `public/images/photos-in-album/` and put all related photos there.
3. Update `src/stores/gallery.ts` to add the new album and map its photos.

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

Inspired by modern, aesthetic gallery designs.
