# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoodAura is a static landing page for an emotional well-being tracking mobile app. The site is deployed on GitHub Pages at www.moodaura.app and serves to introduce the app, provide download links, and host legal documentation.

## Development Commands

This is a pure static site with no build process:
- **Run locally**: Open `index.html` in a browser or use a local web server (e.g., `python -m http.server`)
- **Deploy**: Push to the `main` branch - GitHub Pages automatically deploys
- **No build/lint/test commands** - Direct file editing only

## Architecture

### Static Site Structure
- Pure HTML/CSS/JavaScript with no build tools or frameworks
- All dependencies loaded from CDN (marked.js for Markdown rendering)
- Multi-language support (EN/FR) via JSON translation files
- Legal pages dynamically load Markdown content from `assets/legal/`

### Key Files
- `index.html`: Main landing page with all sections
- `js/app.js`: Handles translations, age verification, contact form, and Markdown loading
- `css/style.css`: All styling with CSS custom properties for theming
- `translations/`: JSON files for multi-language support
- `CNAME`: Points to www.moodaura.app for custom domain

### JavaScript Functionality
The `app.js` file manages:
- Language switching with URL parameters and localStorage persistence
- Age verification modal (stores acceptance in localStorage)
- Dynamic legal page content loading from Markdown files
- Contact form validation with character counting
- Bot detection to hide contact form from crawlers

### Deployment
- Hosted on GitHub Pages
- No environment variables or secrets
- CNAME file must remain for custom domain
- `.well-known` directory included in `_config.yml` for app association

## Important Notes

- Contact form is client-side only - no backend submission endpoint
- All app screenshots are in `assets/images/` (screenshot-1.png through screenshot-19.png)
- Legal documents are bilingual Markdown files that get rendered client-side
- The site uses localStorage for language preference and age verification status