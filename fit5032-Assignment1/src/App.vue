<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import EventCard from './components/EventCard.vue'
import AuthModal from './components/AuthModal.vue'
import AdminPanel from './components/AdminPanel.vue'
import CreateEventModal from './components/CreateEventModal.vue'
import { sportsNews, sportCategories } from './data/sportsData.js'
import { sanitizeInput, validateNumeric, validateEmail } from './utils/security.js'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from './utils/storage.js'

// App state
const currentUser = ref(null)
const showAuthModal = ref(false)
const authMode = ref('login')
const users = ref([])
const events = ref([])
const isScrolled = ref(false)
const showCreateEventForm = ref(false)

// Computed properties
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isUser = computed(() => currentUser.value?.role === 'user')

// Data loading
const loadDataFromStorage = () => {
  const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])
  const savedUsers = loadFromLocalStorage(STORAGE_KEYS.USERS, [])
  const savedCurrentUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)
  
  if (savedEvents.length > 0) {
    events.value = savedEvents.map(event => ({
      ...event,
      ratings: event.ratings || [],
      averageRating: event.averageRating || 0,
      organizerId: event.organizerId || null
    }))
  }
  if (savedUsers.length > 0) users.value = savedUsers
  if (savedCurrentUser) currentUser.value = savedCurrentUser
}

// Auth functions
const login = (formData) => {
  const username = sanitizeInput(formData.username)
  const user = users.value.find(u => u.username === username && u.password === formData.password)
  if (user) {
    currentUser.value = user
    saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, user)
    showAuthModal.value = false
  } else {
    alert('Invalid credentials')
  }
}

const register = (formData) => {
  const username = sanitizeInput(formData.username)
  if (!username || username.length < 3) {
    alert('Username must be at least 3 characters')
    return
  }
  // Password must contain at least 1 uppercase, 1 number, 1 special char, and be 8+ chars
  const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  if (!formData.password || !strongPassword.test(formData.password)) {
    alert('Password must be 8+ chars with uppercase, number and special char')
    return
  }
  const email = (formData.email || '').toLowerCase().trim()
  if (!validateEmail(email)) {
    alert('Please enter a valid email')
    return
  }
  if (users.value.find(u => u.username === username)) {
    alert('Username already exists')
    return
  }
  
  const newUser = { 
    id: Date.now(), 
    username: username,
    password: formData.password,
    role: formData.role,
    email: email
  }
  users.value.push(newUser)
  saveToLocalStorage(STORAGE_KEYS.USERS, users.value)
  currentUser.value = newUser
  saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, newUser)
  showAuthModal.value = false
}

const logout = () => {
  currentUser.value = null
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

// Event functions
const addEventToData = (newEvent) => {
  const eventWithId = {
    ...newEvent,
    id: Date.now(),
    participants: 0,
    status: 'upcoming',
    organizer: currentUser.value.username,
    organizerId: currentUser.value.id,
    ratings: [],
    averageRating: 0
  }
  events.value.unshift(eventWithId)
  saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
}

const deleteEvent = (eventId) => {
  const event = events.value.find(e => e.id === eventId)
  if (!event) return
  
  const canDelete = isAdmin.value || 
                   (isUser.value && event.organizerId === currentUser.value.id) ||
                   (isUser.value && event.organizer === currentUser.value.username)
  
  if (!canDelete) {
    alert('You can only delete your own events')
    return
  }
  
  if (confirm('Are you sure you want to delete this event?')) {
    events.value = events.value.filter(e => e.id !== eventId)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  }
}

const rateEvent = (eventId, rating) => {
  if (!currentUser.value || !validateNumeric(rating, 1, 5)) return
  
  const event = events.value.find(e => e.id === eventId)
  if (!event) return
  
  if (!event.ratings) event.ratings = []
  const existingRating = event.ratings.find(r => r.userId === currentUser.value.id)
  
  if (existingRating) {
    existingRating.rating = parseInt(rating)
  } else {
    event.ratings.push({
      userId: currentUser.value.id,
      username: sanitizeInput(currentUser.value.username),
      rating: parseInt(rating),
      timestamp: Date.now()
    })
  }
  
  event.averageRating = event.ratings.reduce((sum, r) => sum + r.rating, 0) / event.ratings.length
  saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
}

// Utility functions
const toggleAuthMode = () => {
  authMode.value = authMode.value === 'login' ? 'register' : 'login'
}

const clearAllEvents = () => {
  if (confirm('Are you sure you want to clear all events?')) {
    events.value = []
    saveToLocalStorage(STORAGE_KEYS.EVENTS, [])
  }
}

const showCreateForm = () => {
  if (!currentUser.value) {
    showAuthModal.value = true
    return
  }
  showCreateEventForm.value = true
}

const createEvent = (eventData) => {
  addEventToData(eventData)
  alert('Event created successfully!')
  showCreateEventForm.value = false
}

const scrollToActivities = () => {
  const activitiesSection = document.getElementById('activities')
  if (activitiesSection) {
    activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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
      :current-user="currentUser"
      :is-admin="isAdmin"
      :is-scrolled="isScrolled"
      @logout="logout"
      @show-auth="showAuthModal = true"
    />

    <section id="hero" class="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <div class="hero-bg position-absolute w-100 h-100"></div>
      <div class="container text-center position-relative">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <h1 class="hero-title mb-4">SportSync</h1>
            <p class="lead fs-2 mb-3 hero-subtitle text-white">Connect Through Sports, Reach Your Health Goals</p>
            <p class="fs-5 mb-5 text-white" style="opacity: 0.9;">Discover, Book, Participate - Your One-Stop Sports Platform</p>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button type="button" class="btn btn-primary btn-lg px-5 py-3 rounded-pill" @click="scrollToActivities">
                <i class="bi bi-calendar-event me-2"></i>Book Now
              </button>
              <button type="button" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill" @click="showCreateForm" v-if="currentUser">
                <i class="bi bi-plus-circle me-2"></i>Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-indicator position-absolute bottom-0 start-50 translate-middle-x mb-4">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <section id="news" class="py-5 news-section text-white">
      <div class="container py-5">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-4 fw-bold mb-3">Sports News</h2>
            <p class="lead text-light opacity-75">Stay updated with the latest local sports activities and events</p>
          </div>
        </div>
        <div class="row g-4">
          <div v-for="news in sportsNews" :key="news.id" class="col-12 col-md-6 col-lg-4">
            <div class="card news-card">
              <div class="position-relative overflow-hidden">
                <img :src="news.image" :alt="news.title" class="card-img-top news-image">
                <div class="position-absolute top-0 start-0 m-3">
                  <span class="badge bg-primary rounded-pill">{{ news.category }}</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column news-content">
                <div class="d-flex align-items-center mb-2">
                  <small class="text-primary fw-semibold">{{ news.date }}</small>
                </div>
                <h5 class="card-title fw-bold">{{ news.title }}</h5>
                <p class="card-text text-muted">{{ news.summary }}</p>
                <button class="btn btn-outline-primary mt-auto align-self-start">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="activities" class="py-5 bg-gradient-light">
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-12">
            <div class="text-center mb-4">
              <h2 class="display-4 fw-bold text-dark">Activity Display</h2>
              <p class="lead text-muted">Following are the created activities</p>
            </div>
          </div>
        </div>
        <div>
          <div class="row g-4" v-if="events.length > 0">
            <div v-for="event in events" :key="event.id" class="col-lg-6">
              <EventCard 
                :event="event"
                :current-user="currentUser"
                :is-user="isUser"
                :is-admin="isAdmin"
                @delete="deleteEvent"
                @rate="rateEvent"
                @login-required="showAuthModal = true"
              />
            </div>
          </div>
          <div v-else class="text-center py-5">
            <i class="bi bi-calendar-x display-1 text-muted"></i>
            <h3 class="mt-3 text-muted">No Event Data Available</h3>
            <p class="text-muted">No events have been created yet</p>
          </div>
        </div>
      </div>
    </section>

    <AuthModal 
      :show="showAuthModal"
      :auth-mode="authMode"
      @close="showAuthModal = false"
      @login="login"
      @register="register"
      @toggle-mode="toggleAuthMode"
    />

    <CreateEventModal 
      :show="showCreateEventForm"
      :categories="sportCategories"
      @close="showCreateEventForm = false"
      @create="createEvent"
    />

    <AdminPanel 
      v-if="isAdmin"
      :users="users"
      :events="events"
      @clear-events="clearAllEvents"
    />

    <footer class="bg-dark text-white py-4">
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

.hero-section {
  background: url('/hero-background.jpg') center/cover no-repeat !important;
  position: relative;
  min-height: 100vh !important;
}

.hero-bg {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  color: #ffffff !important;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-subtitle {
  font-weight: 300;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
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

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.scroll-indicator {
  opacity: 0.7;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.news-card {
  border-radius: 20px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid #dee2e6;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
}

.news-image {
  width: 100% !important;
  height: 250px !important;
  object-fit: cover !important;
  object-position: center !important;
}

.news-content {
  height: 180px !important;
  padding: 1.5rem !important;
  overflow: hidden;
}

.news-section {
  background: #000000 !important;
}

.bg-gradient-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

html {
  scroll-behavior: smooth;
}

i.display-1 {
  font-size: 4rem;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .news-content {
    height: 140px;
    padding: 1rem;
  }
  
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}
</style>
