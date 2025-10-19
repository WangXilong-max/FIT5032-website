<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import CreateEventModal from './components/CreateEventModal.vue'
import { sportCategories } from './data/sportsData.js'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from './utils/storage.js'

const router = useRouter()

// App state
const events = ref([])
const isScrolled = ref(false)
const showCreateEventForm = ref(false)

// Provide global state to child components
provide('appState', {
  events
})

// Data loading
const loadDataFromStorage = () => {
  const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])

  if (savedEvents.length > 0) {
    events.value = savedEvents.map(event => ({
      ...event,
      ratings: event.ratings || [],
      averageRating: event.averageRating || 0
    }))
  }
}

// Event functions
const addEventToData = (newEvent) => {
  const eventWithId = {
    ...newEvent,
    id: Date.now(),
    participants: 0,
    status: 'upcoming',
    ratings: [],
    averageRating: 0
  }
  events.value.unshift(eventWithId)
  saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
}

const deleteEvent = (eventId) => {
  if (confirm('Are you sure you want to delete this event?')) {
    events.value = events.value.filter(e => e.id !== eventId)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  }
}

const rateEvent = (eventId, rating) => {
  const event = events.value.find(e => e.id === eventId)
  if (!event || !rating) return

  if (!event.ratings) event.ratings = []

  event.ratings.push({
    rating: parseInt(rating),
    timestamp: Date.now()
  })

  event.averageRating = event.ratings.reduce((sum, r) => sum + r.rating, 0) / event.ratings.length
  saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
}

// Utility functions
const clearAllEvents = () => {
  if (confirm('Are you sure you want to clear all events?')) {
    events.value = []
    saveToLocalStorage(STORAGE_KEYS.EVENTS, [])
  }
}

const showCreateForm = () => {
  showCreateEventForm.value = true
}

const createEvent = (eventData) => {
  addEventToData(eventData)
  alert('Event created successfully!')
  showCreateEventForm.value = false
  router.push('/activities')
}

// Lifecycle
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
  loadDataFromStorage()

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  })
})
</script>

<template>
  <div id="app">
    <NavigationBar
      :is-scrolled="isScrolled"
    />

    <router-view
      :events="events"
      @create-event="showCreateForm"
      @delete="deleteEvent"
      @rate="rateEvent"
      @clear-events="clearAllEvents"
    />

    <CreateEventModal
      :show="showCreateEventForm"
      :categories="sportCategories"
      @close="showCreateEventForm = false"
      @create="createEvent"
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
