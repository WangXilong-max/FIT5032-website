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
    const { getAllActivities } = await import('@/firebase/database')
    const firestoreEvents = await getAllActivities()

    if (firestoreEvents.length > 0) {
      events.value = firestoreEvents.map(event => ({
        ...event,
        ratings: event.ratings || [],
        averageRating: event.averageRating || 0,
        participants: event.participants || [],
        participantCount: event.participantCount || 0
      }))

      saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
    } else {
      const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])

      events.value = savedEvents.map(event => ({
        ...event,
        ratings: event.ratings || [],
        averageRating: event.averageRating || 0,
        participants: event.participants || [],
        participantCount: event.participantCount || 0
      }))
    }
  } catch (error) {
    console.error('Error loading data:', error)
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
  const event = events.value.find(e => e.id === eventId)
  if (!event || event.creatorId !== currentUser.value?.id) {
    alert('Only creator can delete this event')
    return
  }
  
  if (!confirm('Delete this event?')) return
  
  try {
    const { deleteActivity } = await import('@/firebase/database')
    await deleteActivity(eventId)
    events.value = events.value.filter(e => e.id !== eventId)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  } catch (error) {
    console.error('Error deleting event:', error)
    alert('Failed to delete event')
  }
}

const rateEvent = async (eventId, rating) => {
  const event = events.value.find(e => e.id === eventId)
  if (!event || !rating || !currentUser.value) {
    return
  }

  try {
    // Add rating to Firestore
    const { addRating } = await import('@/firebase/database')
    const success = await addRating(eventId, rating, currentUser.value.id)

    if (!success) {
      console.error('Failed to add rating to Firestore')
      return
    }

    // Reload data from Firestore to get the updated ratings
    await loadDataFromStorage()

  } catch (error) {
    console.error('Error rating event:', error)
  }
}

const joinEvent = async (eventId) => {
  if (!currentUser.value) return

  const event = events.value.find(e => e.id === eventId)
  if (!event) return

  try {
    const { joinActivity } = await import('@/firebase/database')
    await joinActivity(eventId, currentUser.value.id)

    events.value = events.value.map(e => {
      if (e.id === eventId && !e.participants?.includes(currentUser.value.id)) {
        return {
          ...e,
          participants: [...(e.participants || []), currentUser.value.id],
          participantCount: (e.participantCount || 0) + 1
        }
      }
      return e
    })

    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)

    // Send email to organizer
    if (event.creatorEmail) {
      const { initEmailJS, sendActivityBookingNotification } = await import('@/utils/emailService')
      initEmailJS()
      await sendActivityBookingNotification({
        organizerEmail: event.creatorEmail,
        organizerName: event.creatorName,
        activityName: event.name,
        participantName: currentUser.value.displayName || currentUser.value.email,
        participantEmail: currentUser.value.email,
        activityDate: event.date,
        activityTime: event.time,
        activityLocation: event.location
      })
    }
  } catch (error) {
    console.error('Error joining event:', error)
    alert('Failed to join event')
  }
}

const leaveEvent = async (eventId) => {
  if (!currentUser.value) return

  try {
    const { leaveActivity } = await import('@/firebase/database')
    await leaveActivity(eventId, currentUser.value.id)

    events.value = events.value.map(e => {
      if (e.id === eventId && e.participants?.includes(currentUser.value.id)) {
        return {
          ...e,
          participants: e.participants.filter(id => id !== currentUser.value.id),
          participantCount: Math.max(0, (e.participantCount || 1) - 1)
        }
      }
      return e
    })

    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  } catch (error) {
    console.error('Error leaving event:', error)
    alert('Failed to leave event')
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
    } else {
      // Check local storage as fallback
      const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)
      if (localUser) {
        currentUser.value = localUser
      } else {
        currentUser.value = null
      }
    }
  })

  // Run migration on mount to add missing fields to old activities
  const runMigration = async () => {
    try {
      const { migrateActivitiesToIncludeRatings } = await import('@/utils/migrateActivities')
      const result = await migrateActivitiesToIncludeRatings()

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

/* Accessibility: Enhanced focus styles for keyboard navigation */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible {
  outline: 3px solid #0d6efd;
  outline-offset: 2px;
}
</style>
