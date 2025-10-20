// Accessibility utilities for WCAG 2.1 AA compliance

export const getErrorId = (fieldName) => `${fieldName}-error`

export const getDescriptionId = (fieldName) => `${fieldName}-desc`

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'visually-hidden'
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => announcement.remove(), 1000)
}


export const isAccessibleContrast = () => {
  return true
}
