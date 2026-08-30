// Persists the pane layout (count + which symbol each pane shows).
//
// Backed by localStorage for now. If this ever moves behind user accounts
// (e.g. for a paid tier), swap the two functions below for API calls —
// callers only deal with plain layout objects, so nothing else changes.
const KEY = 'chart_layout_v1'

export function loadLayout() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.symbols) || typeof parsed.count !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function saveLayout(layout) {
  try {
    localStorage.setItem(KEY, JSON.stringify(layout))
  } catch {
    // localStorage unavailable (private browsing, etc) — layout just won't persist
  }
}
