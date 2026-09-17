import { reactive, watch } from 'vue'

const KEY = 'wordie_settings'

const DEFAULTS = {
  maxGuesses: 6,
  prefilled: 1,
  smartKeyboard: true,
}

function clamp(val, min, max, fallback) {
  const n = Number(val)
  if (Number.isNaN(n)) return fallback
  return Math.max(min, Math.min(max, Math.round(n)))
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function writeStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

// Settings are scoped per player profile. `profileIdRef` is a ref holding the
// currently active profile's id (or null); the returned reactive settings
// object always reflects that profile's saved config.
export function useSettings(profileIdRef) {
  const settings = reactive({ ...DEFAULTS })

  function load() {
    const id = profileIdRef.value
    const stored = id ? readStore()[id] : null
    settings.maxGuesses = clamp(stored?.maxGuesses, 3, 10, DEFAULTS.maxGuesses)
    settings.prefilled = clamp(stored?.prefilled, 0, 3, DEFAULTS.prefilled)
    settings.smartKeyboard = typeof stored?.smartKeyboard === 'boolean' ? stored.smartKeyboard : DEFAULTS.smartKeyboard
  }

  watch(profileIdRef, load, { immediate: true })

  watch(
    settings,
    () => {
      const id = profileIdRef.value
      if (!id) return
      const store = readStore()
      store[id] = {
        maxGuesses: settings.maxGuesses,
        prefilled: settings.prefilled,
        smartKeyboard: settings.smartKeyboard,
      }
      writeStore(store)
    },
    { deep: true },
  )

  return settings
}
