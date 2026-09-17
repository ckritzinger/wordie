<script setup>
import { ref } from 'vue'

defineProps({
  settings: { type: Object, required: true },
})

const open = ref(false)
</script>

<template>
  <button class="gear" aria-label="Settings" @click="open = true">⚙</button>

  <div v-if="open" class="overlay" @click.self="open = false">
    <div class="panel">
      <h2>Settings</h2>
      <p class="hint">Changes apply to the next new game.</p>

      <label class="row">
        <span>Max guesses</span>
        <input type="range" min="3" max="10" step="1" v-model.number="settings.maxGuesses" />
        <span class="value">{{ settings.maxGuesses }}</span>
      </label>

      <label class="row">
        <span>Pre-filled letters</span>
        <input type="range" min="0" max="3" step="1" v-model.number="settings.prefilled" />
        <span class="value">{{ settings.prefilled }}</span>
      </label>

      <label class="row toggle">
        <span>Smart keyboard</span>
        <input type="checkbox" v-model="settings.smartKeyboard" />
      </label>

      <button class="close" @click="open = false">Done</button>
    </div>
  </div>
</template>

<style scoped>
.gear {
  position: fixed;
  top: max(10px, env(safe-area-inset-top, 0px));
  right: 10px;
  z-index: 40;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #999;
  opacity: 0.35;
  font-size: 1.1rem;
  border-radius: 50%;
}

.gear:active {
  opacity: 0.6;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.panel h2 {
  margin: 0 0 4px;
}

.hint {
  color: #888;
  font-size: 0.85rem;
  margin: 0 0 16px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.row span:first-child {
  flex: 1;
  font-weight: 600;
}

.row input[type='range'] {
  flex: 1.4;
}

.row .value {
  width: 20px;
  text-align: right;
  font-weight: 700;
}

.row.toggle {
  justify-content: space-between;
}

.close {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: var(--green);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 8px;
}
</style>
