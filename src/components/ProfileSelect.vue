<script setup>
import { ref } from 'vue'
import { AVATARS } from '../composables/useProfiles.js'

defineProps({
  profiles: { type: Array, required: true },
})
const emit = defineEmits(['select', 'create'])

const creating = ref(false)
const name = ref('')
const avatar = ref(AVATARS[0])

function startCreate() {
  creating.value = true
  name.value = ''
  avatar.value = AVATARS[Math.floor(Math.random() * AVATARS.length)]
}

function confirmCreate() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('create', { name: trimmed, avatar: avatar.value })
  creating.value = false
}
</script>

<template>
  <div class="screen">
    <h1 class="title">Wordie</h1>
    <p class="subtitle">Who's playing?</p>

    <div v-if="!creating" class="grid">
      <button v-for="p in profiles" :key="p.id" class="profile-card" @click="emit('select', p.id)">
        <span class="avatar">{{ p.avatar }}</span>
        <span class="name">{{ p.name }}</span>
      </button>

      <button class="add-card" @click="startCreate">
        <span class="plus">+</span>
        <span class="label">Add player</span>
      </button>
    </div>

    <div v-else class="create-card">
      <label class="field-label">Name</label>
      <input v-model="name" maxlength="20" placeholder="Enter name" class="name-input" @keyup.enter="confirmCreate" />

      <label class="field-label">Avatar</label>
      <div class="avatar-grid">
        <button
          v-for="a in AVATARS"
          :key="a"
          class="avatar-option"
          :class="{ selected: avatar === a }"
          @click="avatar = a"
        >
          {{ a }}
        </button>
      </div>

      <div class="actions">
        <button class="cancel" @click="creating = false">Cancel</button>
        <button class="confirm" :disabled="!name.trim()" @click="confirmCreate">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px calc(24px + env(safe-area-inset-bottom, 0px));
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0;
}

.subtitle {
  color: #888;
  font-weight: 600;
  margin: 6px 0 0;
}

.grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  width: 100%;
  max-width: 380px;
}

.profile-card,
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 10px;
  border-radius: 18px;
  border: none;
}

.profile-card {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.profile-card:active {
  transform: scale(0.96);
}

.profile-card .avatar {
  font-size: 2.2rem;
}

.profile-card .name {
  font-weight: 700;
  color: var(--text-dark);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-card {
  background: transparent;
  border: 2px dashed #cfcfcf;
  color: #999;
  justify-content: center;
}

.add-card:active {
  transform: scale(0.96);
}

.add-card .plus {
  font-size: 1.8rem;
  line-height: 1;
}

.add-card .label {
  font-weight: 700;
  font-size: 0.9rem;
}

.create-card {
  margin-top: 32px;
  width: 100%;
  max-width: 340px;
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.field-label {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 6px;
}

.name-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-empty);
  font-size: 1rem;
  margin-bottom: 18px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 20px;
}

.avatar-option {
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  border: none;
  background: #f5f5f5;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-option.selected {
  background: #dbeafe;
  box-shadow: 0 0 0 2px #3b82f6 inset;
}

.actions {
  display: flex;
  gap: 10px;
}

.cancel,
.confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
}

.cancel {
  background: #f0f0f0;
  color: #666;
}

.confirm {
  background: #3b82f6;
  color: #fff;
}

.confirm:disabled {
  opacity: 0.4;
}
</style>
