<script setup>
import { ref, onMounted, onUnmounted, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from './utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'

const route = useRoute()

// App state
const events = ref([])
const isScrolled = ref(false)
const currentUser = ref(null)

// Provide global state to child components
provide('appState', {
  events
})

// Data loading
const loadDataFromStorage = async () => {
  try {
    // Load from Firestore
    const { getAllActivities } = await import('@/firebase/database')
    const firestoreEvents = await getAllActivities()

    console.log('Loading events from Firestore:', firestoreEvents.length, 'events found')

    if (firestoreEvents.length > 0) {
      events.value = firestoreEvents.map(event => ({
        ...event,
        ratings: event.ratings || [],
        averageRating: event.averageRating || 0,
        participants: event.participants || [],
        participantCount: event.participantCount || 0
      }))

      // Save to localStorage as backup
      saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
    } else {
      // Fallback to localStorage if Firestore is empty
      const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])
      console.log('Fallback to localStorage:', savedEvents.length, 'events found')

      events.value = savedEvents.map(event => ({
        ...event,
        ratings: event.ratings || [],
        averageRating: event.averageRating || 0,
        participants: event.participants || [],
        participantCount: event.participantCount || 0
      }))
    }

    console.log('Final events array:', events.value)
  } catch (error) {
    console.error('Error loading data:', error)
    // Fallback to localStorage on error
    const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])
    events.value = savedEvents
  }
}

// Event functions
const addEventToData = (newEvent) => {
  // The event already comes with all necessary properties from CreateActivityView
  events.value.unshift(newEvent)
  // No need to save to localStorage here as CreateActivityView already does it
}

const deleteEvent = async (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      // Delete from Firestore
      const { deleteActivity } = await import('@/firebase/database')
      await deleteActivity(eventId)

      // Update local state
      events.value = events.value.filter(e => e.id !== eventId)
      saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)

      console.log('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    }
  }
}

const rateEvent = async (eventId, rating) => {
  const event = events.value.find(e => e.id === eventId)
  if (!event || !rating || !currentUser.value) {
    console.log('Cannot rate:', { event: !!event, rating, currentUser: !!currentUser.value })
    return
  }

  console.log('Rating event:', { eventId, rating, userId: currentUser.value.id })

  try {
    // Add rating to Firestore
    const { addRating } = await import('@/firebase/database')
    const success = await addRating(eventId, rating, currentUser.value.id)

    if (!success) {
      console.error('Failed to add rating to Firestore')
      return
    }

    console.log('Rating added to Firestore successfully')

    // Reload data from Firestore to get the updated ratings
    await loadDataFromStorage()

    console.log('Data reloaded from Firestore after rating')
  } catch (error) {
    console.error('Error rating event:', error)
  }
}

const joinEvent = async (eventId) => {
  // Use the global currentUser instead of loading from storage
  if (!currentUser.value) {
    console.log('No user logged in')
    return
  }

  console.log('Joining event with user ID:', currentUser.value.id)

  try {
    // Join activity in Firestore
    const { joinActivity } = await import('@/firebase/database')
    await joinActivity(eventId, currentUser.value.id)

    // Update local state
    events.value = events.value.map(event => {
      if (event.id === eventId) {
        if (!event.participants) event.participants = []
        if (!event.participants.includes(currentUser.value.id)) {
          console.log('Adding user to participants:', currentUser.value.id)
          return {
            ...event,
            participants: [...event.participants, currentUser.value.id],
            participantCount: event.participants.length + 1
          }
        } else {
          console.log('User already joined this event')
        }
      }
      return event
    })

    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
    console.log('Joined event successfully')
  } catch (error) {
    console.error('Error joining event:', error)
    alert('Failed to join event. Please try again.')
  }
}

const leaveEvent = async (eventId) => {
  // Use the global currentUser instead of loading from storage
  if (!currentUser.value) return

  console.log('Leaving event with user ID:', currentUser.value.id)

  try {
    // Leave activity in Firestore
    const { leaveActivity } = await import('@/firebase/database')
    await leaveActivity(eventId, currentUser.value.id)

    // Update local state
    events.value = events.value.map(event => {
      if (event.id === eventId && event.participants) {
        console.log('Removing user from participants:', currentUser.value.id)
        return {
          ...event,
          participants: event.participants.filter(id => id !== currentUser.value.id),
          participantCount: Math.max(0, event.participants.length - 1)
        }
      }
      return event
    })

    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
    console.log('Left event successfully')
  } catch (error) {
    console.error('Error leaving event:', error)
    alert('Failed to leave event. Please try again.')
  }
}

// Utility functions
const clearAllEvents = () => {
  if (confirm('Are you sure you want to clear all events?')) {
    events.value = []
    saveToLocalStorage(STORAGE_KEYS.EVENTS, [])
  }
}

// Lifecycle
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
  loadDataFromStorage()

  // Set up Firebase authentication listener
  const unsubscribe = onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      // User is signed in with Firebase
      currentUser.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email
      }
      console.log('App.vue - Firebase user detected:', firebaseUser.email, 'ID:', firebaseUser.uid)
    } else {
      // Check local storage as fallback
      const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)
      if (localUser) {
        currentUser.value = localUser
        console.log('App.vue - Local storage user detected:', localUser)
      } else {
        currentUser.value = null
        console.log('App.vue - No user logged in')
      }
    }
  })

  // Run migration on mount to add missing fields to old activities
  const runMigration = async () => {
    try {
      const { migrateActivitiesToIncludeRatings } = await import('@/utils/migrateActivities')
      const result = await migrateActivitiesToIncludeRatings()
      console.log('Migration result:', result)

      // Reload data after migration
      if (result.updatedCount > 0) {
        await loadDataFromStorage()
      }
    } catch (error) {
      console.error('Migration error:', error)
    }
  }

  // Run migration once
  runMigration()

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
    unsubscribe()
  })
})

// Watch for route changes to reload data
watch(() => route.path, () => {
  loadDataFromStorage()
}, { immediate: false })
</script>

<template>
  <div id="app">
    <NavigationBar
      :is-scrolled="isScrolled"
    />

    <router-view
      :events="events"
      @delete="deleteEvent"
      @rate="rateEvent"
      @join="joinEvent"
      @leave="leaveEvent"
      @add-event="addEventToData"
      @clear-events="clearAllEvents"
    />

    <footer class="bg-dark text-white py-4 mt-auto">
      <div class="container">
        <div class="text-center">
          <h5 class="fw-bold mb-2">SportSync</h5>
          <p class="text-muted mb-3">Your Sports Activity Platform</p>
          <div class="mb-3">
            <span class="text-muted me-3">
              <i class="bi bi-envelope me-1"></i>contact@sportsync.com
            </span>
            <span class="text-muted">
              <i class="bi bi-telephone me-1"></i>+1 (555) 123-4567
            </span>
          </div>
          <p class="text-muted mb-0">&copy; 2024 SportSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.btn-primary {
  background: #000000 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  background: #1a1a1a !important;
  color: white !important;
  border: none !important;
}

.btn-primary:focus,
.btn-primary:active,
.btn-primary:focus-visible {
  background: #000000 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  outline: none !important;
}

html {
  scroll-behavior: smooth;
}
</style>
