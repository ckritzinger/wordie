<script setup>
defineProps({
  profile: { type: Object, default: null },
  history: { type: Array, required: true },
})
defineEmits(['back'])

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="screen">
    <button class="back" @click="$emit('back')">← Back</button>

    <div class="header">
      <span class="avatar">{{ profile?.avatar }}</span>
      <h1 class="title">{{ profile?.name }}'s History</h1>
    </div>

    <div v-if="history.length" class="list">
      <div v-for="(entry, i) in history" :key="i" class="row">
        <span class="badge" :class="entry.won ? 'won' : 'lost'">{{ entry.won ? '🏆' : '✕' }}</span>
        <span class="word">{{ entry.word }}</span>
        <span class="tries">{{ entry.won ? `${entry.tries} ${entry.tries === 1 ? 'try' : 'tries'}` : 'not solved' }}</span>
        <span class="date">{{ formatDate(entry.date) }}</span>
      </div>
    </div>
    <p v-else class="empty">No games played yet. Go play one!</p>
  </div>
</template>

<style scoped>
.screen {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 58;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
}

.back {
  align-self: flex-start;
  border: none;
  background: #f0f0f0;
  color: #666;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.header .avatar {
  font-size: 1.8rem;
}

.title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0;
}

.list {
  width: 100%;
  max-width: 420px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px 14px;
}

.badge {
  font-size: 1.1rem;
  width: 26px;
  text-align: center;
}

.badge.lost {
  color: #b0b0b0;
}

.word {
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--text-dark);
  flex: 1;
}

.tries {
  font-size: 0.85rem;
  font-weight: 600;
  color: #777;
}

.date {
  font-size: 0.75rem;
  color: #aaa;
  width: 52px;
  text-align: right;
}

.empty {
  margin-top: 60px;
  color: #999;
  font-weight: 600;
}
</style>
