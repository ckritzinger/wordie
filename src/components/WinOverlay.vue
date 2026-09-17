<script setup>
import { computed } from 'vue'
import GameTile from './GameTile.vue'
import LetterRain from './LetterRain.vue'

const props = defineProps({
  status: { type: String, required: true }, // 'won' | 'lost'
  targetWord: { type: String, required: true },
  tries: { type: Number, required: true },
})
defineEmits(['play-again', 'change-player'])

const revealCells = computed(() => props.targetWord.split('').map((letter) => ({ letter, state: 'correct' })))
</script>

<template>
  <div class="overlay" :class="{ 'has-rain': status === 'won' }">
    <LetterRain v-if="status === 'won'" />

    <div class="card">
      <template v-if="status === 'won'">
        <div class="trophy">🏆</div>
        <div class="message">Well done!</div>
        <div class="subtext">You guessed the word in {{ tries }} {{ tries === 1 ? 'try' : 'tries' }}!</div>
      </template>

      <div class="banner">
        <div>The mystery word was</div>
        <div class="mini-row">
          <GameTile v-for="(cell, i) in revealCells" :key="i" :letter="cell.letter" :state="cell.state" />
        </div>
      </div>

      <button class="play-again" @click="$emit('play-again')">Play Again</button>
      <button class="change-player" @click="$emit('change-player')">Change Player</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 24px;
  text-align: center;
}

.overlay.has-rain {
  background: transparent;
  backdrop-filter: none;
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.trophy {
  font-size: 5rem;
  animation:
    trophyIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    trophyPulse 1.6s ease-in-out 0.6s infinite;
}

@keyframes trophyIn {
  0% {
    transform: translateY(80px) scale(0.4);
    opacity: 0;
  }
  60% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes trophyPulse {
  0%,
  100% {
    transform: scale(1) rotate(-4deg);
  }
  50% {
    transform: scale(1.15) rotate(4deg);
  }
}

.message {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-dark);
}

.subtext {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin-top: -8px;
}

.banner {
  font-size: 1.1rem;
  font-weight: 700;
  background: #f2f2f2;
  border-radius: 14px;
  padding: 16px 20px;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.mini-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  width: 100%;
  max-width: 220px;
}

.play-again {
  width: 100%;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.play-again:active {
  transform: scale(0.96);
}

.change-player {
  width: 100%;
  padding: 10px;
  border: none;
  background: transparent;
  color: #888;
  font-weight: 700;
  font-size: 0.9rem;
}

.change-player:active {
  opacity: 0.6;
}
</style>
