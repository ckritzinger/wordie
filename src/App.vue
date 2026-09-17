<script setup>
import { computed, onMounted, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { useProfiles } from './composables/useProfiles.js'
import { useSettings } from './composables/useSettings.js'
import { useGame } from './composables/useGame.js'
import { useConfetti } from './composables/useConfetti.js'
import ProfileSelect from './components/ProfileSelect.vue'
import History from './components/History.vue'
import GameBoard from './components/GameBoard.vue'
import LetterPicker from './components/LetterPicker.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import WinOverlay from './components/WinOverlay.vue'

const profileStore = useProfiles()
const settings = useSettings(toRef(profileStore, 'activeProfileId'))
const game = useGame()
const confetti = useConfetti()

const showHistory = ref(false)

const triesRemaining = computed(() => game.maxGuesses - game.activeRow)
const pickerVisible = computed(() => game.selectedCol !== null)

function startNewGame() {
  game.newGame(settings)
}

function selectProfile(id) {
  profileStore.selectProfile(id)
  startNewGame()
}

function createProfile({ name, avatar }) {
  const profile = profileStore.createProfile(name, avatar)
  selectProfile(profile.id)
}

function playAgain() {
  startNewGame()
}

function changePlayer() {
  showHistory.value = false
  profileStore.clearActiveProfile()
}

watch(
  () => game.status,
  (status) => {
    if (status === 'won' || status === 'lost') {
      profileStore.recordResult(game.targetWord, game.activeRow + 1, status === 'won')
    }
    if (status === 'won') {
      setTimeout(() => confetti.winStorm(), 250)
    }
  },
)

function handleKeydown(e) {
  if (game.status !== 'playing') return
  if (e.key === 'Enter') {
    game.submit()
  } else if (game.selectedCol !== null && /^[a-zA-Z]$/.test(e.key)) {
    game.chooseLetter(e.key)
  }
}

onMounted(() => {
  if (profileStore.activeProfileId) startNewGame()
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <ProfileSelect
    v-if="!profileStore.activeProfileId"
    :profiles="profileStore.profiles"
    @select="selectProfile"
    @create="createProfile"
  />

  <div v-else class="app">
    <div class="top-left-bar">
      <button class="profile-badge" @click="showHistory = true">
        <span class="avatar">{{ profileStore.activeProfile?.avatar }}</span>
        <span class="name">{{ profileStore.activeProfile?.name }}</span>
      </button>
      <button class="change-player-link" @click="changePlayer">Change Player</button>
    </div>

    <SettingsPanel :settings="settings" />

    <div class="game-area">
      <GameBoard
        :rows="game.rows"
        :active-row="game.activeRow"
        :shake-row="game.shakeRow"
        :selected-col="game.selectedCol"
        @select="game.selectCell"
      />

      <div class="message-slot">
        <span v-if="game.message">{{ game.message }}</span>
      </div>

      <button class="guess-btn" :disabled="game.status !== 'playing'" @click="game.submit">Guess</button>
      <div class="tries-remaining">{{ triesRemaining }} tries remaining</div>
    </div>

    <LetterPicker
      :visible="pickerVisible"
      :keyboard-states="game.keyboardStates"
      :smart-keyboard="settings.smartKeyboard"
      @choose="game.chooseLetter"
      @close="game.closeSelection"
    />

    <WinOverlay
      v-if="game.status === 'won' || game.status === 'lost'"
      :status="game.status"
      :target-word="game.targetWord"
      :tries="game.activeRow + 1"
      @play-again="playAgain"
      @change-player="changePlayer"
    />

    <History
      v-if="showHistory"
      :profile="profileStore.activeProfile"
      :history="profileStore.activeHistory"
      @back="showHistory = false"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px calc(16px + env(safe-area-inset-bottom, 0px));
  gap: 14px;
}

.top-left-bar {
  position: fixed;
  top: max(10px, env(safe-area-inset-top, 0px));
  left: 10px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: #f5f5f5;
  border-radius: 999px;
  padding: 4px 12px 4px 6px;
}

.profile-badge .avatar {
  font-size: 1.2rem;
}

.profile-badge .name {
  font-weight: 700;
  font-size: 0.8rem;
  color: #777;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.change-player-link {
  border: none;
  background: transparent;
  color: #3b82f6;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 2px;
}

.change-player-link:active {
  opacity: 0.6;
}

.game-area {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.message-slot {
  height: 20px;
  font-weight: 700;
  color: #555;
  font-size: 0.9rem;
}

.guess-btn {
  width: 100%;
  max-width: 260px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--green);
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.guess-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.guess-btn:disabled {
  opacity: 0.5;
}

.tries-remaining {
  color: #888;
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
