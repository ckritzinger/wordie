import { reactive, computed } from 'vue'

const PROFILES_KEY = 'wordie_profiles'
const ACTIVE_KEY = 'wordie_active_profile'
const HISTORY_KEY = 'wordie_history'

export const AVATARS = ['🦁', '🐯', '🐸', '🐵', '🦊', '🐼', '🦄', '🐙', '🦖', '🐝', '🦋', '🐢']

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useProfiles() {
  const state = reactive({
    profiles: read(PROFILES_KEY, []),
    activeProfileId: read(ACTIVE_KEY, null),
    history: read(HISTORY_KEY, {}),
  })

  state.activeProfile = computed(() => state.profiles.find((p) => p.id === state.activeProfileId) || null)
  state.activeHistory = computed(() => state.history[state.activeProfileId] || [])

  function createProfile(name, avatar) {
    const profile = { id: crypto.randomUUID(), name, avatar }
    state.profiles.push(profile)
    write(PROFILES_KEY, state.profiles)
    return profile
  }

  function selectProfile(id) {
    state.activeProfileId = id
    write(ACTIVE_KEY, id)
  }

  function clearActiveProfile() {
    state.activeProfileId = null
    write(ACTIVE_KEY, null)
  }

  function recordResult(word, tries, won) {
    const id = state.activeProfileId
    if (!id) return
    if (!state.history[id]) state.history[id] = []
    state.history[id].unshift({ word, tries, won, date: Date.now() })
    write(HISTORY_KEY, state.history)
  }

  state.createProfile = createProfile
  state.selectProfile = selectProfile
  state.clearActiveProfile = clearActiveProfile
  state.recordResult = recordResult

  return state
}
