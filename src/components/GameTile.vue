<script setup>
import { computed } from 'vue'

const props = defineProps({
  letter: { type: String, default: '' },
  state: { type: String, default: 'empty' },
  selected: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
})

const REVEALED = ['correct', 'present', 'absent']
const revealed = computed(() => REVEALED.includes(props.state))
</script>

<template>
  <div class="tile" :class="{ clickable }" v-if="state === 'prefilled'">
    <div class="tile-face prefilled">{{ letter }}</div>
  </div>
  <div class="tile" :class="{ clickable }" v-else>
    <div class="tile-inner" :class="{ revealed, selected }">
      <div class="tile-face front" :class="{ filled: state === 'filled' }">{{ letter }}</div>
      <div class="tile-face back" :class="state">{{ letter }}</div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  aspect-ratio: 1 / 1;
  width: 100%;
  perspective: 500px;
}

.tile.clickable {
  cursor: pointer;
}

.tile-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in;
  transform-style: preserve-3d;
}

.tile-inner.revealed {
  transform: rotateX(180deg);
}

.tile-inner.selected .tile-face.front {
  border-color: #3b82f6;
  border-width: 3px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.tile-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 8px;
  font-size: clamp(1.4rem, 7vw, 2.2rem);
  font-weight: 800;
  text-transform: uppercase;
  border: 2px solid var(--border-empty);
  background: #fff;
  color: var(--text-dark);
}

.tile-face.filled {
  border-color: var(--border-filled);
}

.tile-face.back {
  transform: rotateX(180deg);
  color: #fff;
  border-color: transparent;
}

.tile-face.back.correct {
  background: var(--green);
}

.tile-face.back.present {
  background: var(--yellow);
}

.tile-face.back.absent {
  background: var(--grey);
}

.tile-face.prefilled {
  background: var(--green);
  color: #fff;
  border-color: transparent;
}
</style>
