export const STORAGE_KEYS = {
  EVENTS: 'sportsync_events',
  USERS: 'sportsync_users',
  CURRENT_USER: 'sportsync_current_user',
}

export const saveToLocalStorage = (key, data) => {
  try {
    if (!key || typeof key !== 'string') return false
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
    return false
  }
}

export const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    if (!key || typeof key !== 'string') return defaultValue
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    const parsed = JSON.parse(item)
    return parsed || defaultValue
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return defaultValue
  }
}
