const MAX_HISTORY = 8

function normalizeHex(value) {
  if (!value) return null
  const trimmed = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase()
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`
  return null
}

function storageKey(key) {
  return `gdocx:color-history:${key}`
}

export function loadColorHistory(key) {
  try {
    const raw = localStorage.getItem(storageKey(key))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((c) => normalizeHex(c)) : []
  } catch {
    return []
  }
}

export function addColorToHistory(key, color, presetValues = []) {
  const normalized = normalizeHex(color)
  if (!normalized) return loadColorHistory(key)
  if (presetValues.includes(normalized)) return loadColorHistory(key)

  const current = loadColorHistory(key).filter((item) => item !== normalized)
  const next = [normalized, ...current].slice(0, MAX_HISTORY)

  try {
    localStorage.setItem(storageKey(key), JSON.stringify(next))
  } catch {
    // ignore quota errors
  }

  return next
}

export { normalizeHex }
