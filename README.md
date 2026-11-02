# Khanh Nguyen Portfolio

A responsive personal portfolio for Khanh Nguyen, designed as a scroll-driven professional journey. The site presents selected work, experience, interests, and a contact path through an editorial interface with custom pixel-art scenes and motion.

## Overview

This project is a frontend-only application built for a polished portfolio experience across desktop and mobile devices. It includes:

- Scroll-based journey navigation and animated scene transitions
- Experience, projects, hobbies, and contact sections
- Localized Vietnamese, English, Chinese, French, and Czech content
- Responsive layouts with reduced-motion support
- Custom illustrations, CSS animation, and locally hosted assets

## Technology

| Area | Tools |
| --- | --- |
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 and custom CSS |
| Animation | GSAP and CSS animations |
| Testing | Playwright |
| Linting | ESLint |

## Getting started

### Prerequisites

- Node.js 22.12 or newer
- npm

### Installation

```bash
git clone https://github.com/<your-username>/khanh-nguyen-portfolio.git
cd khanh-nguyen-portfolio
npm install
```

### Development

```bash
npm run dev
```

Vite will print the local development URL in the terminal, typically `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Project structure

```text
src/
  animation/       Scroll synchronization and character movement
  assets/          Local fonts, images, and scene assets
  components/      Layout, sections, illustrations, and reusable UI
  context/         Application-level language state
  data/            Portfolio content and translations
  graphics/        Code-generated scenes and project visualizations
  hooks/           Reusable React hooks
  styles/          Global styles, responsive layout, and animations
tests/             Playwright end-to-end tests
```

## Customization

To adapt this repository for a different portfolio, begin with:

- `src/data/portfolio.js` for experience and project content
- `src/data/translations.js` for interface copy and localized content
- `src/components/sections/Contact.jsx` for contact information
- `src/assets/pixel/` for portfolio imagery

## Quality checks

Before deployment, run:

```bash
npm run lint
npm run build
npm run test:e2e
```

## License

This repository is intended for Khanh Nguyen's personal portfolio. Do not reuse personal content, imagery, or identity details without permission.
