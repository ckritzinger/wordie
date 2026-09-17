# Kids Wordle Game Spec

2026-09-17 . @Someone

A 4-letter word-guessing game for ages 6-8, built in Vue 3 and deployed to GitHub Pages.

## Overview

A mobile-first word-guessing game for children aged 6-8, played in portrait mode on a phone. The player guesses a random 4-letter word within a configurable number of attempts. A configurable number of letters are pre-filled in the grid at game start to reduce difficulty for younger children. The game runs entirely in the browser with no backend.

**Design principles:** large tap targets, bright standard Wordle colours (green/yellow/grey), no timers, no sound, no accounts. Restart is always one tap away.

## Word List

The game ships with a curated static word list embedded in the app (no external API calls). All words are exactly 4 letters, common English, and appropriate for a 6-8 year old reading level.

**Curation criteria:**

- Concrete, familiar nouns and verbs (BALL, DUCK, JUMP, RAIN, FISH)
- No slang, no archaic words, no words with ambiguous spelling for children
- Exclude words that could be considered rude or confusing in a school context
- Target list size: 300-500 words (enough variety, small enough to vet manually)

**Word selection at game start:** one word chosen at random from the full list each new game. No repeat-prevention across sessions (stateless).

**Validation:** the guessed word must exist in the same word list. Invalid guesses show a gentle shake animation on the row and do not consume a turn.

## Game Configuration

Configuration is not exposed in the main UI. A settings panel is accessed via a small gear icon in the top-right corner of the screen. The icon is intentionally subtle (low opacity, small size) so children do not interact with it.

**Configurable options:**

| Setting | Default | Range | Notes |
| --- | --- | --- | --- |
| Max guesses | 6 | 3-10 | Number of rows in the grid |
| Pre-populated letters | 1 | 0-3 | Letters revealed at game start |
| Smart keyboard | On | On/Off | Disables impossible letters |

**Pre-populated letter behaviour:** at game start, N letters from the target word are chosen at random (positions chosen randomly, not necessarily contiguous). They appear in the grid in their correct positions, coloured green, and are locked — the player cannot change them. They do not count as a guess.

**Settings persistence:** stored in localStorage so the parent's settings survive a page refresh. Settings apply from the next new game.

## Game Board

The board is a grid of (max guesses) rows x 4 columns. Each cell is a square tile with a large, bold letter. The board is centred horizontally and sized to leave room for the keyboard below.

**Tile states:**

| State | Colour | When |
| --- | --- | --- |
| Empty | White / light grey border | Not yet typed |
| Filled (unsubmitted) | White with dark border | Letter typed, guess not yet submitted |
| Pre-populated | Green (locked) | Set at game start |
| Correct | Green | Letter in correct position after submission |
| Present | Yellow | Letter in word but wrong position after submission |
| Absent | Grey | Letter not in word after submission |

**Active row indicator:** the current guess row has a slightly highlighted border to orient the child.

**Tile flip animation:** on submission, tiles in the active row flip one by one (left to right), revealing their colour state as they land. The confetti/animation (see Game Flow) fires in sync with each tile flip.

## On-Screen Keyboard

An alphabetic keyboard (A-Z in order) rendered below the game board. All input goes through this keyboard; no physical keyboard input is required (though physical keyboard input can work as a bonus on desktop).

**Layout:** 26 letters arranged alphabetically in rows of roughly equal width (e.g. 7 / 7 / 6 / 6), plus a bottom row with a Backspace key (left) and an Enter/Submit key (right). Keys are large enough to tap comfortably on a phone. Alphabetic order is more intuitive for children still learning to read.

**Colour feedback:** after each submitted guess, key colours update to reflect the best known state of that letter across all guesses so far. Colour priority: green > yellow > grey. Keys not yet guessed remain the default colour.

**Smart keyboard mode (configurable, default: on):** in this mode, letters that are logically impossible are visually disabled (greyed out and non-interactive). A letter is impossible when:

- It was marked absent (grey) in a previous guess AND is not known to appear elsewhere in the word

Note: smart mode does NOT disable yellow letters or green letters — those remain active since the child may need to type them again in a different position. Only definitively impossible letters are disabled.

## Game Flow

**Turn sequence:**

1. Player taps letters on the keyboard to fill the active row (4 letters)
2. Player taps Enter/Submit
3. If the word is not in the word list: the row shakes, a small "Try another word!" message appears briefly, no turn consumed
4. If valid: tile flip animation runs left to right, one tile every \~300ms
5. As each tile flips and reveals its colour:
   - Green tile: a confetti burst fires from that tile
   - Yellow tile: a smaller confetti burst fires from that tile
   - Grey tile: tile settles grey, no animation
6. After the last tile settles: check win/lose condition
7. If neither: advance to the next row, clear the input

**Confetti spec:**

- Green tile burst: \~40-60 particles, multi-colour, spread \~120px radius, 800ms duration
- Yellow tile burst: \~15-25 particles, multi-colour, spread \~60px radius, 500ms duration
- Particles use a lightweight CSS/canvas confetti library (e.g. canvas-confetti)
- Bursts originate from the centre of the flipped tile

**Input constraints:** pre-populated (green, locked) positions are skipped when the player types — the cursor jumps to the next unlocked cell. Backspace only affects unlocked cells.

## Win and Lose States

**Win:** triggered when all 4 letters in the submitted guess are green.

- A full-screen confetti storm runs for \~2 seconds
- A large trophy emoji (trophy) animates in from below (scale + bounce)
- A "Well done!" message appears beneath the trophy
- A "Play Again" button appears below the message
- The board and keyboard are locked (no further input)

**Lose:** triggered when the player submits their final guess and it is incorrect.

- No confetti
- The target word is revealed in a banner below the board, e.g. "The word was DUCK"
- A "Play Again" button appears
- The board and keyboard are locked

**Play Again:** resets all state, picks a new random word, applies current config (including fresh pre-populated letters). The grid and keyboard return to their initial state. No page reload.

## Technical Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Vue 3 (Composition API) | Vite as build tool |
| Package manager | pnpm |  |
| Animations | CSS transitions + canvas-confetti | canvas-confetti for particle bursts |
| Styling | Plain CSS or Tailwind (CSS preferred for simplicity) | No UI component library |
| State | Vue reactive / composables | No Vuex/Pinia needed at this scale |
| Persistence | localStorage | Settings only; no game state persisted |
| Deployment | GitHub Pages via gh-pages branch | Build output: dist/ |
| CI | GitHub Actions | Build + deploy on push to main |

**Project structure (suggested):**

```
src/
  components/
    GameBoard.vue
    GameTile.vue
    GameKeyboard.vue
    SettingsPanel.vue
    WinOverlay.vue
  composables/
    useGame.js       # core game logic
    useConfetti.js   # confetti helpers
    useSettings.js   # config + localStorage
  data/
    words.js         # curated word list array
  App.vue
  main.js
```

**GitHub Pages deployment:** `vite.config.js` sets `base` to the repo name. A GitHub Actions workflow runs `pnpm build` and deploys `dist/` to `gh-pages` on every push to `main`.
