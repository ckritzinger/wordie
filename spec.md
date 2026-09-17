# Kids Wordle Game Spec

2026-09-17 . @Someone

A 4-letter word-guessing game for ages 6-8, built in Vue 3 and deployed to GitHub Pages.

## Overview

A mobile-first word-guessing game for children aged 6-8, played in portrait mode on a phone. The player guesses a random 4-letter word within a configurable number of attempts. A configurable number of letters are pre-filled in the grid at game start to reduce difficulty for younger children. The game runs entirely in the browser with no backend, using local player profiles (no login, no server) so siblings can each keep their own settings and history on the same device.

**Design principles:** large tap targets, bright standard Wordle colours (green/yellow/grey), no timers, no sound, no online accounts or login. Restart is always one tap away.

## Player Profiles

Before playing, a child picks (or creates) a local player profile — a name and an emoji avatar, stored only in this browser's localStorage (no login, no server, no sync between devices).

**Profile select screen:** shown whenever there is no active profile — on first visit, or after tapping "Change Player" (see Win and Lose States). It shows a grid of existing profiles as tappable cards (avatar + name) plus an "Add player" card. Tapping a profile makes it active and starts a new game immediately. If no profile is active, this is the only screen shown — the game board, keyboard, and settings gear are not rendered at all.

**Creating a profile:** tapping "Add player" shows a small form: a name field (required, trimmed, max 20 characters) and a grid of preset emoji avatars to choose from. "Create" is disabled until a name is entered. Creating a profile makes it the active profile and starts a game.

**Active profile indicator:** while playing, a small badge in the top-left corner shows the active player's avatar and name. Tapping it opens the History screen (see below). Next to the badge, a "Change Player" text link is always available — tapping it clears the active profile and returns to the profile select screen immediately, abandoning any in-progress game (no confirmation prompt). The same "Change Player" action also appears as a button on the win/lose screen for convenience at the natural end of a game.

**Data scope:** game configuration (see Game Configuration) and guess history (see History) are both scoped per profile — switching players switches both.

## History

Tapping the profile badge opens a full-screen History view for the active player: a "← Back" button returns to the game, and below a "{avatar} {name}'s History" heading is a list of every game that player has finished, most recent first. Each row shows: a trophy icon (win) or an ✕ (loss), the target word, the number of tries taken (or "not solved" for a loss), and the date. If no games have been finished yet, a friendly empty state is shown instead ("No games played yet. Go play one!").

History is purely local: it's stored in localStorage, keyed by profile, and simply grows as the child plays — there's no leaderboard, scoring, or comparison between players.

## Word List

The game ships with a curated static word list embedded in the app (no external API calls). All words are exactly 4 letters, common English, and appropriate for a 6-8 year old reading level.

**Curation criteria:**

- Concrete, familiar nouns and verbs (BALL, DUCK, JUMP, RAIN, FISH)
- No slang, no archaic words, no words with ambiguous spelling for children
- Exclude words that could be considered rude or confusing in a school context
- Target list size: 300-500 words (enough variety, small enough to vet manually)

**Word selection at game start:** one word chosen at random from the full list each new game. No repeat-prevention across sessions (stateless).

**Guess validation:** the word list is only used to pick the target word — guesses are NOT checked against it. Any 4-letter combination the child fills in can be submitted; the only requirement is that every cell in the row is filled. This keeps things simple for a 6-8 year old who may not know every word in the list, or may want to test out letters.

## Game Configuration

Configuration is not exposed in the main UI. A settings panel is accessed via a small gear icon in the top-right corner of the screen. The icon is intentionally subtle (low opacity, small size) so children do not interact with it.

**Configurable options:**

| Setting | Default | Range | Notes |
| --- | --- | --- | --- |
| Max guesses | 6 | 3-10 | Number of rows in the grid |
| Pre-populated letters | 1 | 0-3 | Letters revealed at game start |
| Smart keyboard | On | On/Off | Disables impossible letters |

**Pre-populated letter behaviour:** at game start, N letters from the target word are chosen at random (positions chosen randomly, not necessarily contiguous). They appear in the grid in their correct positions, coloured green, and are locked — the player cannot change them. They do not count as a guess.

**Carrying forward correct letters:** once a letter is confirmed correct (green) in a submitted guess, that position becomes locked and pre-filled green in every subsequent row too — the same treatment as a pre-populated letter. The child never has to re-enter a letter they've already gotten right; the set of locked positions only grows as the game progresses.

**Settings persistence:** stored in localStorage, scoped to the active player profile, so each child's settings survive a page refresh and switching players doesn't mix up configs. Settings apply from the next new game.

## Game Board

The board shows only the current guess row and any previously-submitted rows — upcoming empty rows are not rendered, so the board grows one row at a time as the child plays. Each cell is a square tile with a large, bold letter. The board is centred horizontally.

**Tile states:**

| State | Colour | When |
| --- | --- | --- |
| Empty | White / light grey border | Not yet typed |
| Filled (unsubmitted) | White with dark border | Letter picked, guess not yet submitted |
| Selected | White with blue highlight border | Currently-tapped cell, letter picker open |
| Pre-populated | Green (locked) | Set at game start |
| Correct | Green | Letter in correct position after submission |
| Present | Yellow | Letter in word but wrong position after submission |
| Absent | Grey | Letter not in word after submission |

**Active row indicator:** the current guess row has a slightly highlighted border to orient the child.

**Tile flip animation:** on submission, tiles in the active row flip one by one (left to right), revealing their colour state as they land. The confetti/animation (see Game Flow) fires in sync with each tile flip.

**Below the board:** a "Guess" button submits the current row, and beneath it a small counter reads "N tries remaining" (N = max guesses − rows already shown, i.e. including the row in progress).

## Letter Picker

There is no persistent on-screen keyboard. Instead, tapping any empty or filled (non-locked) cell in the active row opens a letter picker: a bottom sheet listing A-Z. Tapping a letter fills the tapped cell with that letter and the picker closes immediately. Tapping outside the sheet closes it without changing the cell.

This means letters can be filled in any order — the child can tap the 3rd letter spot first, then the 1st, etc. To change a letter already filled, tap that cell again and pick a different letter; there is no separate backspace or delete control. Pre-populated (locked) cells are not tappable. Physical keyboard input can work as a bonus on desktop: with the picker open, pressing a letter key chooses it; Enter submits the row at any time.

**Layout:** 26 letters arranged alphabetically in rows of roughly equal width (e.g. 7 / 7 / 6 / 6). Keys are large enough to tap comfortably on a phone. Alphabetic order is more intuitive for children still learning to read.

**Colour feedback:** after each submitted guess, key colours update to reflect the best known state of that letter across all guesses so far. Colour priority: green > yellow > grey. Keys not yet guessed remain the default colour.

**Smart keyboard mode (configurable, default: on):** in this mode, letters that are logically impossible are visually disabled (greyed out and non-interactive). A letter is impossible when:

- It was marked absent (grey) in a previous guess AND is not known to appear elsewhere in the word

Note: smart mode does NOT disable yellow letters or green letters — those remain active since the child may need to type them again in a different position. Only definitively impossible letters are disabled.

## Game Flow

**Turn sequence:**

1. Player taps any unlocked cell in the active row, picks a letter from the picker (in any order, any cell), repeats until all 4 cells are filled — re-tapping a filled cell lets them change it
2. Player taps the "Guess" button below the row
3. If any cell is still empty: the row shakes, a small "Fill in every letter!" message appears briefly, no turn consumed
4. Otherwise the guess is accepted (no dictionary check — see Guess validation above): tile flip animation runs left to right, one tile every \~300ms
5. As each tile flips and reveals its colour:
   - Green tile: a confetti burst fires from that tile
   - Yellow tile: a smaller confetti burst fires from that tile
   - Grey tile: tile settles grey, no animation
6. After the last tile settles: check win/lose condition
7. If neither: a new row appears below and becomes the active row, with any newly-confirmed correct (green) positions pre-filled and locked; the tries-remaining counter decrements

**Confetti spec:**

- Green tile burst: \~40-60 particles, multi-colour, spread \~120px radius, 800ms duration
- Yellow tile burst: \~15-25 particles, multi-colour, spread \~60px radius, 500ms duration
- Particles use a lightweight CSS/canvas confetti library (e.g. canvas-confetti)
- Bursts originate from the centre of the flipped tile

**Input constraints:** pre-populated (green, locked) cells cannot be tapped or changed. Any other cell in the active row can be tapped and (re)filled independently of the others, in any order.

## Win and Lose States

**Win:** triggered when all 4 letters in the submitted guess are green.

- A full-screen background of falling, multi-coloured letters ("letter rain") animates behind the win card, in the same matrix-rain style as the confetti/particle effects
- A full-screen confetti storm runs for \~2 seconds
- A large trophy emoji (trophy) animates in from below (scale + bounce), then keeps a gentle continuous wobble/pulse for as long as the win screen is showing
- A "Well done!" message appears beneath the trophy
- A subtext line reads "You guessed the word in N tries!" (N = number of guesses submitted, singular "try" when N is 1)
- A banner reads "The mystery word was", and below it — on a new line — the word itself is shown as a mini row of green tiles, styled the same as a completed row on the game board
- A "Play Again" button (blue) appears below the message
- A "Change Player" text link appears below "Play Again", returning to the profile select screen
- The board is locked and cells can no longer be tapped (no further input)
- The result (word, tries, win/lose) is recorded to the active profile's history

**Lose:** triggered when the player submits their final guess and it is incorrect.

- No confetti, no letter rain
- A banner reads "The mystery word was", with the word shown as a mini row of green tiles (same treatment as the win screen) on a new line below
- A "Play Again" button (blue) appears
- A "Change Player" text link appears below "Play Again", returning to the profile select screen
- The board is locked and cells can no longer be tapped
- The result (word, tries, win/lose) is recorded to the active profile's history

**Play Again:** resets all state, picks a new random word, applies current config (including fresh pre-populated letters). The grid returns to its initial state (a single active row). No page reload.

## Technical Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Vue 3 (Composition API) | Vite as build tool |
| Package manager | pnpm |  |
| Animations | CSS transitions + canvas-confetti | canvas-confetti for particle bursts |
| Styling | Plain CSS or Tailwind (CSS preferred for simplicity) | No UI component library |
| State | Vue reactive / composables | No Vuex/Pinia needed at this scale |
| Persistence | localStorage | Player profiles, per-profile settings, and per-profile history; no in-progress game state persisted |
| Deployment | GitHub Pages via gh-pages branch | Build output: dist/ |
| CI | GitHub Actions | Build + deploy on push to main |

**Project structure (suggested):**

```
src/
  components/
    GameBoard.vue
    GameTile.vue
    History.vue
    LetterPicker.vue
    LetterRain.vue
    ProfileSelect.vue
    SettingsPanel.vue
    WinOverlay.vue
  composables/
    useGame.js       # core game logic
    useConfetti.js   # confetti helpers
    useProfiles.js   # player profiles + history, localStorage
    useSettings.js   # per-profile config + localStorage
  data/
    words.js         # curated word list array
  App.vue
  main.js
```

**GitHub Pages deployment:** `vite.config.js` sets `base` to the repo name. A GitHub Actions workflow runs `pnpm build` and deploys `dist/` to `gh-pages` on every push to `main`.
