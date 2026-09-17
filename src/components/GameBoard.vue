<script setup>
import { computed, watch } from 'vue'
import GameTile from './GameTile.vue'
import { useConfetti } from '../composables/useConfetti.js'

const props = defineProps({
  rows: { type: Array, required: true },
  activeRow: { type: Number, required: true },
  shakeRow: { type: Number, required: true },
  selectedCol: { type: Number, default: null },
})
const emit = defineEmits(['select'])

const visibleRows = computed(() => props.rows.slice(0, props.activeRow + 1))

const confetti = useConfetti()
const tileEls = {}

function setTileRef(ri, ci, el) {
  if (!el) return
  tileEls[`${ri}-${ci}`] = el.$el || el
}

function handleTileClick(ri, ci, cell) {
  if (ri !== props.activeRow || cell.locked) return
  emit('select', ci)
}

let prevStates = props.rows.map((row) => row.map((cell) => cell.state))

watch(
  () => props.rows,
  (rows) => {
    rows.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const prev = prevStates[ri]?.[ci]
        if (prev !== cell.state) {
          if (cell.state === 'correct' || cell.state === 'present') {
            const el = tileEls[`${ri}-${ci}`]
            if (el) {
              const rect = el.getBoundingClientRect()
              const x = rect.left + rect.width / 2
              const y = rect.top + rect.height / 2
              if (cell.state === 'correct') confetti.greenBurst(x, y)
              else confetti.yellowBurst(x, y)
            }
          }
          if (!prevStates[ri]) prevStates[ri] = []
          prevStates[ri][ci] = cell.state
        }
      })
    })
  },
  { deep: true },
)
</script>

<template>
  <div class="board">
    <div
      v-for="(row, ri) in visibleRows"
      :key="ri"
      class="board-row"
      :class="{ active: ri === activeRow, shake: ri === shakeRow }"
    >
      <GameTile
        v-for="(cell, ci) in row"
        :key="ci"
        :ref="(el) => setTileRef(ri, ci, el)"
        :letter="cell.letter"
        :state="cell.state"
        :selected="ri === activeRow && ci === selectedCol"
        :clickable="ri === activeRow && !cell.locked"
        @click="handleTileClick(ri, ci, cell)"
      />
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.board-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  border-radius: 10px;
  padding: 2px;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.board-row.active {
  border-color: #a9adb0;
}

.board-row.shake {
  animation: shake 0.35s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}
</style>
