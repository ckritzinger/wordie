# Wordie

A 4-letter Wordle clone for kids aged 6-8. Vue 3 (`<script setup>`) + plain CSS, no backend — all state in `localStorage`. Built with Vite, deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Stack
- Vue 3 SFCs, Composition API, `<script setup>`
- Plain scoped CSS per component (no Tailwind, no UI library)
- Vite build, `pnpm` package manager
- `canvas-confetti` for particle bursts (tile reveals + win storm)
- No router — `App.vue` gates a single view: `ProfileSelect` (no active profile) vs. the game (active profile), with `WinOverlay`/`History` as overlays on top of the game

## Structure
- `src/App.vue` — wires `useProfiles`, `useSettings`, `useGame` together; owns the profile-select vs. game top-level switch
- `src/components/` — `ProfileSelect`, `GameBoard`, `GameTile`, `LetterPicker`, `SettingsPanel`, `WinOverlay`, `History`, `LetterRain`
- `src/composables/useGame.js` — core game state/logic (word pick, guess scoring, reveal timing), no DOM
- `src/composables/useProfiles.js` — player profiles + per-profile guess history, `localStorage`
- `src/composables/useSettings.js` — per-profile config (max guesses, prefilled letters, smart keyboard), `localStorage`
- `src/composables/useConfetti.js` — thin wrapper around `canvas-confetti`
- `src/data/words.js` — curated ~310-word list, all exactly 4 letters
- `spec.md` — the product spec this was built from; keep it in sync with behavior changes

## Conventions / things to know

- **Composables must return a single `reactive({...})` object, never a plain object with bare `ref()`/`computed()` properties.** Vue only auto-unwraps refs that are top-level `<script setup>` bindings — `someComposable().someRef` accessed off a plain object does NOT unwrap, silently yielding the Ref/ComputedRef object itself (truthy, `NaN` in arithmetic, `!== null` always true). This caused a genuinely "very broken" bug (empty board, `NaN tries remaining`, letter picker stuck open) that took a full debugging pass to trace. `useGame.js` and `useProfiles.js` both build one `reactive()` state object and attach methods to it as plain properties. If a composable needs to hand a single reactive property to another composable as a live reference (e.g. `useSettings(profileIdRef)`), use `toRef(state, 'prop')`, not the raw property.
- **Guesses are NOT validated against the word list.** The word list (`data/words.js`) is only used to pick the target word. Any 4-letter combination can be submitted — this was a deliberate spec change (kids shouldn't be blocked by not knowing a word is "valid"). Don't reintroduce a dictionary check on submit.
- **No persistent on-screen keyboard.** Tapping an unlocked cell in the active row opens `LetterPicker` (a bottom sheet); picking a letter fills that cell and auto-closes the sheet. Letters can be filled in any order. There's no backspace key — re-tap a filled cell to change it.
- **Only the current + previously-submitted rows are rendered** (`GameBoard`'s `visibleRows` slices `rows` to `activeRow + 1`). Future rows aren't pre-built; `useGame.newGame()` only builds one row, and `submit()` pushes the next row lazily.
- **Correct (green) letters carry forward.** Once a position is confirmed correct, it's added to `lockedCols` and every subsequent row pre-fills it green (same treatment as the initial pre-populated letters). This compounds with the configured "pre-populated letters" setting — don't treat them as separate mechanisms.
- **Settings and history are scoped per player profile**, not global. `useSettings` takes a ref to the active profile id and re-reads/re-writes the profile's slice of the `wordie_settings` localStorage object whenever that id changes.
- **`LetterRain.vue`'s drops start pre-scattered across the full canvas height**, not all above-screen like x-blitz's `NumberRain.vue`. It's shown behind a short-lived win overlay (not a home screen users linger on), so starting sparse-then-filling would mean it's barely visible before the player taps away.
- Mobile viewport handling: `100dvh` + `env(safe-area-inset-*)`-aware padding throughout, to avoid browser chrome covering the board/keyboard.

## Commands
```bash
pnpm install
pnpm dev       # local dev server
pnpm build     # production build to dist/
pnpm preview   # preview the production build
```

## Deploy
Push to `main` → GitHub Actions builds with pnpm and deploys `dist/` to GitHub Pages (repo Pages source is already set to "GitHub Actions"). `vite.config.js` `base` is hardcoded to `/wordie/` — update it if the repo is ever renamed.
