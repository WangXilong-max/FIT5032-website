<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const events = ref([])
const STORAGE_KEYS = {
  EVENTS: 'sportsync_events'
}

// localStorage functions
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

const loadDataFromStorage = () => {
  const savedEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])
  if (savedEvents.length > 0) {
    events.value = savedEvents
  }
}

// Add event
const addEventToData = (newEvent) => {
  const eventWithId = {
    ...newEvent,
    id: Date.now(),
    participants: 0,
    status: 'upcoming',
    organizer: 'Current User'
  }
  
  events.value.unshift(eventWithId)
  saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
}

const sportsNews = ref([
  {
    id: 1,
    title: 'Weekend Badminton Tournament',
    summary: 'Join our amateur badminton tournament. All levels welcome!',
    date: '2024-01-15',
    image: '/badminton.jpeg',
    category: 'Badminton'
  },
  {
    id: 2,
    title: '3v3 Basketball Challenge',
    summary: 'Show off your street ball skills against top teams',
    date: '2024-01-14',
    image: '/basketball.jpeg',
    category: 'Basketball'
  },
  {
    id: 3,
    title: 'Swimming Evening Sessions',
    summary: 'New evening time slots for working professionals',
    date: '2024-01-13',
    image: '/swimming.jpeg',
    category: 'Swimming'
  }
])

const isScrolled = ref(false)
const showCreateEventForm = ref(false)
const eventFormData = ref({
  eventName: '',
  eventDate: '',
  eventTime: '',
  location: '',
  category: '',
  maxParticipants: '',
  ticketPrice: '',
  description: '',
  contactEmail: ''
})

const errors = ref({})

const sportCategories = ref([
  'Basketball', 'Football', 'Tennis', 'Badminton', 
  'Swimming', 'Table Tennis', 'Volleyball', 'Running', 
  'Cycling', 'Fitness', 'Yoga', 'Other'
])

// Form validation
const validateForm = () => {
  const form = eventFormData.value
  const newErrors = {}
  
  if (!form.eventName.trim() || form.eventName.trim().length < 3) {
    newErrors.eventName = "Event name must be at least 3 characters"
  }
  if (!form.eventDate) {
    newErrors.eventDate = "Please select an event date"
  }
  if (!form.eventTime) {
    newErrors.eventTime = "Please select an event time"
  }
  if (!form.location.trim() || form.location.trim().length < 5) {
    newErrors.location = "Location must be at least 5 characters"
  }
  if (!form.category) {
    newErrors.category = "Please select a sport category"
  }
  if (!form.maxParticipants || parseInt(form.maxParticipants) < 1) {
    newErrors.maxParticipants = "Please enter a valid number of participants"
  }
  if (form.ticketPrice === '' || parseFloat(form.ticketPrice) < 0) {
    newErrors.ticketPrice = "Please enter a valid ticket price (0 or above)"
  }
  if (!form.description.trim() || form.description.trim().length < 10) {
    newErrors.description = "Description must be at least 10 characters"
  }
  if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) {
    newErrors.contactEmail = "Please enter a valid email address"
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Form submission
const submitEventForm = () => {
  if (validateForm()) {
    const newEvent = {
      name: eventFormData.value.eventName,
      category: eventFormData.value.category,
      date: eventFormData.value.eventDate,
      time: eventFormData.value.eventTime,
      location: eventFormData.value.location,
      maxParticipants: parseInt(eventFormData.value.maxParticipants),
      price: parseFloat(eventFormData.value.ticketPrice),
      description: eventFormData.value.description,
      contactEmail: eventFormData.value.contactEmail
    }
    
    addEventToData(newEvent)
    alert('Event created successfully!')
    resetForm()
    showCreateEventForm.value = false
  } else {
    alert('Please correct the errors in the form')
  }
}

// Reset form
const resetForm = () => {
  eventFormData.value = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: '',
    maxParticipants: '',
    ticketPrice: '',
    description: '',
    contactEmail: ''
  }
  errors.value = {}
}

// Show create form
const showCreateForm = () => {
  showCreateEventForm.value = true
  resetForm()
}

// Scroll to activities section
const scrollToActivities = () => {
  const activitiesSection = document.getElementById('activities')
  if (activitiesSection) {
    activitiesSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
  
  loadDataFromStorage()
  
  const handleBeforeUnload = () => {
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    saveToLocalStorage(STORAGE_KEYS.EVENTS, events.value)
  })
})
</script>

<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-dark fixed-top" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <span class="brand-text">SportSync</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#hero">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#news">Sports News</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#activities">Book Activities</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">About Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <section id="hero" class="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <div class="hero-bg position-absolute w-100 h-100"></div>
      <div class="container text-center position-relative">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <h1 class="hero-title mb-4">
              SportSync
            </h1>
            <p class="lead fs-2 mb-3 hero-subtitle text-white">Connect Through Sports, Reach Your Health Goals</p>
            <p class="fs-5 mb-5 text-white" style="opacity: 0.9;">Discover, Book, Participate - Your One-Stop Sports Platform</p>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button type="button" class="btn btn-primary btn-lg px-5 py-3 rounded-pill" @click="scrollToActivities">
                <i class="bi bi-calendar-event me-2"></i>Book Now
              </button>
              <button type="button" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill" @click="showCreateForm">
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
          <div 
            v-for="news in sportsNews" 
            :key="news.id" 
            class="col-12 col-md-6 col-lg-4"
          >
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
              <div class="card event-card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <span class="badge bg-dark text-white rounded-pill">{{ event.category }}</span>
                    <span class="badge bg-dark text-white rounded-pill ms-2" v-if="event.status === 'upcoming'">Upcoming</span>
                    <span class="badge bg-dark text-white rounded-pill ms-2" v-else-if="event.status === 'ongoing'">Ongoing</span>
                  </div>
                  <small class="text-muted">
                    <i class="bi bi-calendar me-1"></i>{{ event.date }}
                  </small>
                </div>
                <div class="card-body">
                  <h5 class="card-title fw-bold">{{ event.name }}</h5>
                  <p class="card-text text-muted">{{ event.description }}</p>
                  
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>{{ event.time }}
                      </small>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">
                        <i class="bi bi-geo-alt me-1"></i>{{ event.location }}
                      </small>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">
                        <i class="bi bi-person me-1"></i>{{ event.organizer }}
                      </small>
                    </div>
                    <div class="col-6">
                      <small class="text-primary fw-bold">
                        <i class="bi bi-currency-dollar me-1"></i>{{ event.price === 0 ? 'Free' : `$${event.price}` }}
                      </small>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-center">
                      <small class="text-muted">{{ event.participants }}/{{ event.maxParticipants }} participants</small>
                    </div>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <button class="btn btn-primary btn-sm w-100">
                    <i class="bi bi-person-plus me-1"></i>Join Event
                  </button>
                </div>
              </div>
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
    
    <div v-if="showCreateEventForm" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.0);">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color: #000000;">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>Create New Event
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showCreateEventForm = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitEventForm">
              <div class="row">
                <!-- Event Name -->
                <div class="col-md-6 mb-3">
                  <label for="eventName" class="form-label fw-bold">Event Name <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="eventName" 
                    v-model="eventFormData.eventName"
                    :class="{ 'is-invalid': errors.eventName }"
                    placeholder="Enter event name"
                  >
                  <div v-if="errors.eventName" class="invalid-feedback">{{ errors.eventName }}</div>
                </div>

                <!-- Sport Category -->
                <div class="col-md-6 mb-3">
                  <label for="category" class="form-label fw-bold">Sport Category <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    id="category" 
                    v-model="eventFormData.category"
                    :class="{ 'is-invalid': errors.category }"
                  >
                    <option value="">Select sport category</option>
                    <option v-for="category in sportCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                  <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
                </div>

                <!-- Event Date -->
                <div class="col-md-6 mb-3">
                  <label for="eventDate" class="form-label fw-bold">Event Date <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="eventDate" 
                    v-model="eventFormData.eventDate"
                    :class="{ 'is-invalid': errors.eventDate }"
                  >
                  <div v-if="errors.eventDate" class="invalid-feedback">{{ errors.eventDate }}</div>
                </div>

                <!-- Event Time -->
                <div class="col-md-6 mb-3">
                  <label for="eventTime" class="form-label fw-bold">Event Time <span class="text-danger">*</span></label>
                  <input 
                    type="time" 
                    class="form-control" 
                    id="eventTime" 
                    v-model="eventFormData.eventTime"
                    :class="{ 'is-invalid': errors.eventTime }"
                  >
                  <div v-if="errors.eventTime" class="invalid-feedback">{{ errors.eventTime }}</div>
                </div>

                <!-- Event Location -->
                <div class="col-12 mb-3">
                  <label for="location" class="form-label fw-bold">Event Location <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="location" 
                    v-model="eventFormData.location"
                    :class="{ 'is-invalid': errors.location }"
                    placeholder="Enter detailed address"
                  >
                  <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
                </div>

                <!-- Max Participants -->
                <div class="col-md-6 mb-3">
                  <label for="maxParticipants" class="form-label fw-bold">Max Participants <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="maxParticipants" 
                    v-model="eventFormData.maxParticipants"
                    :class="{ 'is-invalid': errors.maxParticipants }"
                    placeholder="Enter number of participants"
                    min="1"
                    max="1000"
                  >
                  <div v-if="errors.maxParticipants" class="invalid-feedback">{{ errors.maxParticipants }}</div>
                </div>

                <!-- Ticket Price -->
                <div class="col-md-6 mb-3">
                  <label for="ticketPrice" class="form-label fw-bold">Ticket Price ($) <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="ticketPrice" 
                    v-model="eventFormData.ticketPrice"
                    :class="{ 'is-invalid': errors.ticketPrice }"
                    placeholder="0.00"
                    min="0"
                    max="10000"
                    step="0.01"
                  >
                  <div v-if="errors.ticketPrice" class="invalid-feedback">{{ errors.ticketPrice }}</div>
                  <div class="form-text">Enter 0 for free events</div>
                </div>

                <!-- Contact Email -->
                <div class="col-12 mb-3">
                  <label for="contactEmail" class="form-label fw-bold">Contact Email <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="contactEmail" 
                    v-model="eventFormData.contactEmail"
                    :class="{ 'is-invalid': errors.contactEmail }"
                    placeholder="example@email.com"
                  >
                  <div v-if="errors.contactEmail" class="invalid-feedback">{{ errors.contactEmail }}</div>
                </div>

                <!-- Event Description -->
                <div class="col-12 mb-3">
                  <label for="description" class="form-label fw-bold">Event Description <span class="text-danger">*</span></label>
                  <textarea 
                    class="form-control" 
                    id="description" 
                    rows="4" 
                    v-model="eventFormData.description"
                    :class="{ 'is-invalid': errors.description }"
                    placeholder="Please describe the event details, rules, and important notes"
                  ></textarea>
                  <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                  <div class="form-text">{{ eventFormData.description.length }}/1000 characters</div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="resetForm">
              <i class="bi bi-arrow-clockwise me-2"></i>Reset Form
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="showCreateEventForm = false">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="submitEventForm">
              <i class="bi bi-check-circle me-2"></i>Create Event
            </button>
          </div>
        </div>
      </div>
    </div>

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

.navbar {
  background: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(10px);
}

.navbar-scrolled {
  background: rgba(0, 0, 0, 0.9) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.brand-text {
  color: #fff !important;
  font-size: 1.5rem;
  font-weight: bold;
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

@media (max-width: 768px) {
  .news-content {
    height: 140px;
    padding: 1rem;
  }
  
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .form-control,
  .form-select {
    font-size: 16px; 
  }
  
  .event-card .card-body {
    padding: 1rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .event-card .row.g-2 .col-6 {
    font-size: 0.875rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}

html {
  scroll-behavior: smooth;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545 !important;
  display: block !important;
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}



.bg-gradient-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.event-card {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  overflow: hidden;
}

.event-card .card-header {
  background: linear-gradient(45deg, #f8f9fa, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.badge {
  font-size: 0.75rem;
  padding: 0.5em 0.75em;
}





i.display-1 {
  font-size: 4rem;
  opacity: 0.3;
}
</style>