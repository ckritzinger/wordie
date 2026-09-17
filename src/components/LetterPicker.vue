<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  keyboardStates: { type: Object, required: true },
  smartKeyboard: { type: Boolean, default: true },
})
const emit = defineEmits(['choose', 'close'])

const ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['O', 'P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y', 'Z'],
]

function isDisabled(letter) {
  return props.smartKeyboard && props.keyboardStates[letter] === 'absent'
}

function press(letter) {
  if (isDisabled(letter)) return
  emit('choose', letter)
}
</script>

<template>
  <div v-if="visible" class="backdrop" @click.self="emit('close')">
    <div class="sheet">
      <div class="kb-row" v-for="(row, ri) in ROWS" :key="ri">
        <button
          v-for="letter in row"
          :key="letter"
          class="key"
          :class="[keyboardStates[letter], { impossible: isDisabled(letter) }]"
          :disabled="isDisabled(letter)"
          @click="press(letter)"
        >
          {{ letter }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 55;
}

.sheet {
  width: 100%;
  max-width: 480px;
  background: #f5f5f5;
  border-radius: 16px 16px 0 0;
  padding: 14px 8px calc(14px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.18s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.kb-row {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.key {
  flex: 1;
  min-width: 0;
  height: 46px;
  border: none;
  border-radius: 8px;
  background: #d3d6da;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    transform 0.1s;
}

.key:active:not(:disabled) {
  transform: scale(0.92);
}

.key.correct {
  background: var(--green);
  color: #fff;
}

.key.present {
  background: var(--yellow);
  color: #fff;
}

.key.absent {
  background: var(--grey);
  color: #fff;
}

.key.impossible {
  background: #ececec;
  color: #b0b0b0;
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  box-shadow: none;
}
</style>
