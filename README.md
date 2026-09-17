# Wordie

A mobile-first Wordle clone built for kids aged 6-8. Guess the 4-letter word, tap letters instead of typing, get help from pre-filled letters, and celebrate with confetti. Vue 3, runs entirely client-side — no backend, no accounts, no login, everything lives in `localStorage`.

## How it plays

- Pick (or create) a local player profile — a name and an emoji avatar.
- Guess a random 4-letter word within a configurable number of tries (default 6).
- No on-screen keyboard sits on the board permanently: tap any empty letter spot to open a letter picker, pick a letter, and it fills in. Fill letters in any order, tap the "Guess" button when the row is full.
- Tiles flip and reveal green (correct spot) / yellow (wrong spot) / grey (not in the word), with confetti bursting off green and yellow tiles.
- A few letters are pre-filled and locked green at the start to help younger kids, and any letter you get right stays locked green in every following row too — you never have to re-enter a letter you've already found.
- Win and the mystery word is revealed with a trophy, a falling-letters background, and a full-screen confetti storm. Lose and it's revealed plainly instead.
- Tap the profile badge any time to see your history — every word you've played and how many tries it took.

## Tech

- **Vue 3** (`<script setup>`, Composition API) — no router, no state library
- **Plain scoped CSS** per component — no Tailwind, no UI library
- **canvas-confetti** for the particle effects
- **Vite** for dev/build, **pnpm** for package management
- All persistence is `localStorage` — no server, no network calls, no accounts

## Getting started

```bash
pnpm install
pnpm dev
```

Then open the printed local URL (best viewed at phone width).

## Build

```bash
pnpm build      # outputs to dist/
pnpm preview    # serve the production build locally
```

## Deploy

Deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. In the repo settings, set **Pages → Source → GitHub Actions**. The Vite `base` path is set to `/wordie/` in `vite.config.js` to match the repo name — update it if the repo is renamed.

## Project structure

```
src/
  App.vue                   # top-level wiring: profiles, settings, game
  components/
    ProfileSelect.vue       # "who's playing" screen, profile create
    GameBoard.vue           # tile grid, tap-to-select, confetti triggers
    GameTile.vue            # single tile, flip animation
    LetterPicker.vue        # bottom-sheet letter picker
    SettingsPanel.vue       # gear-icon settings (max guesses, prefilled, smart keyboard)
    WinOverlay.vue          # win/lose screen, mystery word reveal
    LetterRain.vue          # falling-letters canvas background (win screen)
    History.vue             # per-profile list of past games
  composables/
    useGame.js              # core game logic (word pick, guess scoring, reveal timing)
    useProfiles.js          # player profiles + history, localStorage
    useSettings.js          # per-profile settings, localStorage
    useConfetti.js          # canvas-confetti helpers
  data/
    words.js                # curated ~310-word list (all 4 letters)
```

## Spec

The product spec this game was built against is in [`spec.md`](spec.md).
