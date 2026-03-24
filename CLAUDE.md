# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flag Explorer** — an educational React app for learning world flags. Features a learning mode (browse flags by continent), quiz mode (identify flags), similar-flags comparison, and a special "Nainishha Quiz" mode. Scores persist in localStorage.

## Commands

```bash
npm run dev      # Vite dev server (default :5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Architecture

- **Framework:** React 19, Vite 7, plain CSS (no Tailwind/CSS framework)
- **Language:** JavaScript (JSX, no TypeScript)
- **Routing:** State-based (`useState` page switching in App.jsx), not react-router
- **State:** Component-level `useState`/`useEffect`, score persisted to `localStorage('flagExplorerScore')`
- **Styling:** Single `App.css` file for all styles
- **Flag images:** Loaded via country code from external CDN (flagcdn.com or similar), not bundled locally

### Navigation Model

App.jsx manages a `page` state variable. Pages: `home`, `learn`, `quiz`, `similar`, `nainishha-quiz`. A `selectedFlag` state triggers the `FlagDetail` modal overlay. No URL-based routing.

### Data Layer

All flag data is static JS arrays in `src/data/`:
- `flags.js` — Main flag array (~230 countries). Each entry: `{ name, code, continent, colors, difficulty, tip, details, funFact, animal, similarTo }`
- `countryInfo.js` — Extended country information
- `similarPairs.js` — Pairs of flags that look alike

### Components

| Component | Purpose |
|---|---|
| `Home.jsx` | Landing page with navigation cards and score display |
| `Learn.jsx` | Browse flags filtered by continent |
| `Quiz.jsx` | Flag identification quiz with scoring |
| `NainishhaQuiz.jsx` | Custom quiz variant |
| `SimilarFlags.jsx` | Compare look-alike flags |
| `FlagDetail.jsx` | Modal overlay showing flag details, fun facts |
| `WorldMap.jsx` | World map visualization |

### Voice / Accessibility

Quiz components (`Quiz.jsx`, `NainishhaQuiz.jsx`) use the Web Speech API (`window.speechSynthesis`) to read questions aloud, speak option names on hover/touch, and announce correct/incorrect answers. A `getChildVoice()` helper selects a child-friendly voice. Touch and keyboard support added across all quizzes.

### Score System

Score object: `{ total, correct, streak, bestStreak, stars }`. Passed down from App.jsx via props. Quiz components update via `setScore`. Persisted to localStorage on every change.

## Deployment

- **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`)
- Pushes to `main` trigger build + deploy
- Vite `base` set to `/flag-explorer/` for GitHub Pages subdirectory hosting
