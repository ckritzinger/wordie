import { reactive } from 'vue'
import { WORDS } from '../data/words.js'

const REVEAL_STEP_MS = 300
const MESSAGE_MS = 1200

function emptyCell() {
  return { letter: '', state: 'empty', locked: false }
}

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function randomPositions(count) {
  const positions = [0, 1, 2, 3]
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }
  return positions.slice(0, count)
}

export function useGame() {
  const state = reactive({
    rows: [],
    activeRow: 0,
    maxGuesses: 6,
    status: 'playing', // 'playing' | 'won' | 'lost'
    message: '',
    shakeRow: -1,
    targetWord: '',
    keyboardStates: {},
    selectedCol: null,
  })

  let lockedCols = []

  function buildRow() {
    const row = []
    for (let i = 0; i < 4; i++) {
      if (lockedCols.includes(i)) {
        row.push({ letter: state.targetWord[i], state: 'prefilled', locked: true })
      } else {
        row.push(emptyCell())
      }
    }
    return row
  }

  function newGame(config) {
    state.maxGuesses = config.maxGuesses
    state.targetWord = randomWord()
    lockedCols = randomPositions(config.prefilled)

    state.rows.splice(0, state.rows.length)
    state.rows.push(buildRow())

    Object.keys(state.keyboardStates).forEach((k) => delete state.keyboardStates[k])
    state.activeRow = 0
    state.status = 'playing'
    state.message = ''
    state.shakeRow = -1
    state.selectedCol = null
  }

  function selectCell(col) {
    if (state.status !== 'playing') return
    const cell = state.rows[state.activeRow][col]
    if (cell.locked) return
    state.selectedCol = col
  }

  function closeSelection() {
    state.selectedCol = null
  }

  function chooseLetter(letter) {
    if (state.selectedCol === null) return
    const col = state.selectedCol
    const cell = state.rows[state.activeRow][col]
    cell.letter = letter.toUpperCase()
    cell.state = 'filled'
    state.selectedCol = null
  }

  function flash(text) {
    state.shakeRow = state.activeRow
    state.message = text
    setTimeout(() => {
      state.shakeRow = -1
      state.message = ''
    }, MESSAGE_MS)
  }

  const STATE_PRIORITY = { correct: 3, present: 2, absent: 1 }

  function updateKeyboard(letter, letterState) {
    const current = state.keyboardStates[letter]
    if (!current || STATE_PRIORITY[letterState] > STATE_PRIORITY[current]) {
      state.keyboardStates[letter] = letterState
    }
  }

  function submit() {
    if (state.status !== 'playing') return
    state.selectedCol = null
    const row = state.rows[state.activeRow]
    if (row.some((cell) => cell.state === 'empty')) {
      flash('Fill in every letter!')
      return
    }

    const guess = row.map((cell) => cell.letter).join('')

    const target = state.targetWord
    const finalStates = new Array(4).fill(null)
    const counts = {}
    for (const ch of target) counts[ch] = (counts[ch] || 0) + 1

    for (let i = 0; i < 4; i++) {
      if (guess[i] === target[i]) {
        finalStates[i] = 'correct'
        counts[guess[i]] -= 1
      }
    }
    for (let i = 0; i < 4; i++) {
      if (finalStates[i]) continue
      if (counts[guess[i]] > 0) {
        finalStates[i] = 'present'
        counts[guess[i]] -= 1
      } else {
        finalStates[i] = 'absent'
      }
    }

    const rowIndex = state.activeRow
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        state.rows[rowIndex][i].state = finalStates[i]
        updateKeyboard(guess[i], finalStates[i])

        if (i === 3) {
          const won = finalStates.every((s) => s === 'correct')
          setTimeout(() => {
            if (won) {
              state.status = 'won'
            } else if (rowIndex + 1 >= state.maxGuesses) {
              state.status = 'lost'
            } else {
              for (let c = 0; c < 4; c++) {
                if (finalStates[c] === 'correct' && !lockedCols.includes(c)) {
                  lockedCols.push(c)
                }
              }
              state.rows.push(buildRow())
              state.activeRow = rowIndex + 1
            }
          }, 200)
        }
      }, i * REVEAL_STEP_MS)
    }
  }

  state.newGame = newGame
  state.selectCell = selectCell
  state.closeSelection = closeSelection
  state.chooseLetter = chooseLetter
  state.submit = submit

  return state
}
