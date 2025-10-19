<template>
  <!-- Skip Link for Accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <section class="py-5 bg-gradient-light">
    <div class="container py-5">
      <!-- Loading State -->
      <div v-if="isCheckingAuth" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Checking authentication...</span>
        </div>
        <p class="mt-3">Checking authentication status...</p>
      </div>

      <!-- Auth Check -->
      <div v-else-if="!currentUser" class="text-center py-5">
        <div class="alert alert-warning">
          <h4><i class="bi bi-lock me-2"></i>Authentication Required</h4>
          <p>You need to be logged in to create activities.</p>
          <router-link to="/signin" class="btn btn-primary me-2">Sign In</router-link>
          <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
        </div>
      </div>

      <!-- Main Content (only show if logged in) -->
      <div v-else>
        <!-- Page Header -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="text-center mb-4">
            <h1 class="display-4 fw-bold text-white">
              Create New Activity
            </h1>
            <p class="lead text-white">Plan your sports event with location mapping</p>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <main id="main-content">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <form @submit.prevent="handleSubmit">
            <div class="row">
              <!-- Event Name -->
              <div class="col-md-6 mb-4">
                <label for="eventName" class="form-label fw-bold">
                  Event Name <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="eventName"
                  v-model="form.eventName"
                  @blur="touched.eventName = true; validateField('eventName')"
                  :class="{ 'is-invalid': touched.eventName && errors.eventName }"
                  placeholder="Enter event name"
                  required
                >
                <div v-if="touched.eventName && errors.eventName" class="invalid-feedback">
                  {{ errors.eventName }}
                </div>
              </div>

              <!-- Sport Category -->
              <div class="col-md-6 mb-4">
                <label for="category" class="form-label fw-bold">
                  Sport Category <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select form-select-lg"
                  id="category"
                  v-model="form.category"
                  @blur="touched.category = true; validateField('category')"
                  :class="{ 'is-invalid': touched.category && errors.category }"
                  required
                >
                  <option value="">Select sport category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <div v-if="touched.category && errors.category" class="invalid-feedback">
                  {{ errors.category }}
                </div>
              </div>                  <!-- Event Date -->
                  <div class="col-md-6 mb-4">
                    <label for="eventDate" class="form-label fw-bold">
                      Event Date <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-control form-control-lg"
                      id="eventDate"
                      v-model="form.eventDate"
                      @blur="touched.eventDate = true; validateField('eventDate')"
                      :class="{ 'is-invalid': touched.eventDate && errors.eventDate }"
                      :min="today"
                      required
                    >
                    <div v-if="touched.eventDate && errors.eventDate" class="invalid-feedback">
                      {{ errors.eventDate }}
                    </div>
                  </div>

                  <!-- Event Time -->
                  <div class="col-md-6 mb-4">
                    <label for="eventTime" class="form-label fw-bold">
                      Event Time <span class="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      class="form-control form-control-lg"
                      id="eventTime"
                      v-model="form.eventTime"
                      @blur="touched.eventTime = true; validateField('eventTime')"
                      :class="{ 'is-invalid': touched.eventTime && errors.eventTime }"
                      required
                    >
                    <div v-if="touched.eventTime && errors.eventTime" class="invalid-feedback">
                      {{ errors.eventTime }}
                    </div>
                  </div>

                  <!-- Location Section with Map -->
                  <div class="col-12 mb-4">
                    <label for="location" class="form-label fw-bold">
                      Event Location <span class="text-danger">*</span>
                    </label>
                    <div class="row">
                      <div class="col-md-8">
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="location"
                          v-model="form.location"
                          @blur="touched.location = true; validateField('location')"
                          @input="searchLocation"
                          :class="{ 'is-invalid': touched.location && errors.location }"
                          placeholder="Search for location or enter address"
                          required
                        >
                        <div v-if="touched.location && errors.location" class="invalid-feedback">
                          {{ errors.location }}
                        </div>

                        <!-- Location Suggestions -->
                        <div v-if="locationSuggestions.length > 0" class="mt-2">
                          <div class="list-group">
                            <button
                              v-for="suggestion in locationSuggestions"
                              :key="suggestion.place_id"
                              type="button"
                              class="list-group-item list-group-item-action"
                              @click="selectLocation(suggestion)"
                            >
                              <i class="bi bi-geo-alt me-2"></i>{{ suggestion.description }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-lg w-100"
                          @click="getCurrentLocation"
                          :disabled="gettingLocation"
                        >
                          <i class="bi bi-geo-alt-fill me-2"></i>
                          {{ gettingLocation ? 'Getting Location...' : 'Use Current Location' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Map Display -->
                  <div class="col-12 mb-4">
                    <div class="map-container">
                      <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
                    </div>
                  </div>

                  <!-- Max Participants -->
                  <div class="col-md-6 mb-4">
                    <label for="maxParticipants" class="form-label fw-bold">
                      Max Participants <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="maxParticipants"
                      v-model="form.maxParticipants"
                      @blur="touched.maxParticipants = true; validateField('maxParticipants')"
                      :class="{ 'is-invalid': touched.maxParticipants && errors.maxParticipants }"
                      placeholder="Enter number of participants"
                      min="1"
                      max="1000"
                      required
                    >
                    <div v-if="touched.maxParticipants && errors.maxParticipants" class="invalid-feedback">
                      {{ errors.maxParticipants }}
                    </div>
                  </div>

                  <!-- Registration Fee -->
                  <div class="col-md-6 mb-4">
                    <label for="registrationFee" class="form-label fw-bold">Registration Fee (AUD)</label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="registrationFee"
                      v-model="form.registrationFee"
                      placeholder="Enter fee (optional)"
                      min="0"
                      step="0.01"
                    >
                  </div>

                  <!-- Description -->
                  <div class="col-12 mb-4">
                    <label for="description" class="form-label fw-bold">Event Description</label>
                    <textarea
                      class="form-control"
                      id="description"
                      v-model="form.description"
                      rows="4"
                      placeholder="Describe your event, rules, equipment needed, etc."
                    ></textarea>
                  </div>

                  <!-- Equipment Required -->
                  <div class="col-12 mb-4">
                    <label for="equipment" class="form-label fw-bold">Equipment Required</label>
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      id="equipment"
                      v-model="form.equipment"
                      placeholder="e.g., Bring your own racket, balls provided"
                    >
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="row mt-4">
                  <div class="col-12">
                    <div class="d-flex gap-3 justify-content-center">
                      <button type="button" class="btn btn-outline-secondary btn-lg px-5" @click="goBack">
                        <i class="bi bi-arrow-left me-2"></i>Cancel
                      </button>
                      <button type="submit" class="btn btn-primary btn-lg px-5" :disabled="!isFormValid || isSubmitting">
                        <i class="bi bi-check-circle me-2"></i>
                        {{ isSubmitting ? 'Creating...' : 'Create Activity' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { sportCategories } from '../data/sportsData.js'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '../utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'
import mapboxgl from 'mapbox-gl'

const router = useRouter()

// Define emits
defineEmits(['add-event'])

// User state
const currentUser = ref(null)
const isCheckingAuth = ref(true)

// Mapbox configuration
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid3hsMTIzNzg5IiwiYSI6ImNtZHlid2h1bDAwYmEya3BzMmpvbGFzb2UifQ.PNnx74NZhnHUfa5d1Q_c3w'
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

// Form data
const form = reactive({
  eventName: '',
  category: '',
  eventDate: '',
  eventTime: '',
  location: '',
  maxParticipants: '',
  registrationFee: 0,
  description: '',
  equipment: '',
  latitude: null,
  longitude: null
})

// Form validation
const touched = reactive({
  eventName: false,
  category: false,
  eventDate: false,
  eventTime: false,
  location: false,
  maxParticipants: false
})

const errors = reactive({
  eventName: '',
  category: '',
  eventDate: '',
  eventTime: '',
  location: '',
  maxParticipants: ''
})

// Component state
const isSubmitting = ref(false)
const gettingLocation = ref(false)
const locationSuggestions = ref([])
const map = ref(null)
const marker = ref(null)

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const categories = computed(() => sportCategories)

const isFormValid = computed(() => {
  return form.eventName &&
         form.category &&
         form.eventDate &&
         form.eventTime &&
         form.location &&
         form.maxParticipants &&
         !Object.values(errors).some(error => error)
})

// Validation functions
const validateField = (field) => {
  errors[field] = ''

  switch (field) {
    case 'eventName':
      if (!form.eventName.trim()) {
        errors.eventName = 'Event name is required'
      } else if (form.eventName.length < 3) {
        errors.eventName = 'Event name must be at least 3 characters'
      }
      break

    case 'category':
      if (!form.category) {
        errors.category = 'Please select a sport category'
      }
      break

    case 'eventDate':
      if (!form.eventDate) {
        errors.eventDate = 'Event date is required'
      } else if (new Date(form.eventDate) < new Date()) {
        errors.eventDate = 'Event date cannot be in the past'
      }
      break

    case 'eventTime':
      if (!form.eventTime) {
        errors.eventTime = 'Event time is required'
      }
      break

    case 'location':
      if (!form.location.trim()) {
        errors.location = 'Event location is required'
      }
      break

    case 'maxParticipants':
      if (!form.maxParticipants) {
        errors.maxParticipants = 'Maximum participants is required'
      } else if (form.maxParticipants < 1 || form.maxParticipants > 1000) {
        errors.maxParticipants = 'Participants must be between 1 and 1000'
      }
      break
  }
}

// Location and Map functions
const initializeMapbox = () => {
  const mapElement = document.getElementById('map')
  if (mapElement) {
    // Initialize Mapbox map centered on Melbourne
    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136], // Melbourne coordinates [lng, lat]
      zoom: 13
    })

    // Add navigation controls
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add click event to set location
    map.value.on('click', (e) => {
      const { lng, lat } = e.lngLat
      form.latitude = lat
      form.longitude = lng
      updateMapLocation([lng, lat])
      reverseGeocode(lng, lat)
    })
  }
}

const searchLocation = async () => {
  if (form.location.length > 2) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(form.location)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=AU&limit=5`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        locationSuggestions.value = data.features.map(feature => ({
          place_id: feature.id,
          description: feature.place_name,
          coordinates: feature.center
        }))
      } else {
        locationSuggestions.value = []
      }
    } catch (error) {
      console.error('Error searching location:', error)
      locationSuggestions.value = []
    }
  } else {
    locationSuggestions.value = []
  }
}

const reverseGeocode = async (lng, lat) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    )
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      form.location = data.features[0].place_name
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error)
  }
}

const selectLocation = (suggestion) => {
  form.location = suggestion.description
  locationSuggestions.value = []

  const [lng, lat] = suggestion.coordinates
  form.latitude = lat
  form.longitude = lng
  updateMapLocation([lng, lat])
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    gettingLocation.value = true

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        form.latitude = lat
        form.longitude = lng

        updateMapLocation([lng, lat])
        reverseGeocode(lng, lat)
        gettingLocation.value = false
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your current location. Please enter the address manually.')
        gettingLocation.value = false
      }
    )
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

const updateMapLocation = (coordinates) => {
  if (map.value) {
    const [lng, lat] = coordinates

    // Update map center and zoom
    map.value.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1000
    })

    // Remove existing marker
    if (marker.value) {
      marker.value.remove()
    }

    // Add new marker
    marker.value = new mapboxgl.Marker({
      color: '#000000',
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(map.value)

    // Handle marker drag
    marker.value.on('dragend', () => {
      const lngLat = marker.value.getLngLat()
      form.latitude = lngLat.lat
      form.longitude = lngLat.lng
      reverseGeocode(lngLat.lng, lngLat.lat)
    })
  }
}

// Form submission
const handleSubmit = async () => {
  // Validate all fields
  Object.keys(touched).forEach(field => {
    touched[field] = true
    validateField(field)
  })

  if (!isFormValid.value) {
    alert('Please fix the errors in the form before submitting.')
    return
  }

  isSubmitting.value = true

  try {
    // Create event object
    const eventData = {
      name: form.eventName,
      category: form.category,
      date: form.eventDate,
      time: form.eventTime,
      location: form.location,
      maxParticipants: parseInt(form.maxParticipants),
      price: parseFloat(form.registrationFee) || 0,
      description: form.description || 'No description provided',
      equipment: form.equipment,
      latitude: form.latitude,
      longitude: form.longitude,
      status: 'upcoming',
      creatorId: currentUser.value?.id,  // Store creator ID
      creatorName: currentUser.value?.email || 'Anonymous'  // Store creator name
    }

    // Save to Firestore
    const { createActivity } = await import('@/firebase/database')
    const createdActivity = await createActivity(eventData)

    console.log('Activity saved to Firestore:', createdActivity)

    // Also save to local storage for backwards compatibility
    const existingEvents = loadFromLocalStorage(STORAGE_KEYS.EVENTS, [])
    existingEvents.unshift({ ...createdActivity, id: createdActivity.id })
    saveToLocalStorage(STORAGE_KEYS.EVENTS, existingEvents)

    // Note: Parent component will reload data from Firestore automatically
    // No need to manually emit event

    // Success feedback
    alert('Activity created successfully!')
    isSubmitting.value = false
    router.push('/activities')
  } catch (error) {
    console.error('Error creating activity:', error)
    alert('Failed to create activity. Please try again.')
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/activities')
}

// Lifecycle
onMounted(() => {
  // Check both local storage and Firebase authentication
  const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)

  // Set up Firebase auth state listener
  const unsubscribe = onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      // User is signed in with Firebase
      currentUser.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email
      }
      console.log('Firebase user detected:', currentUser.value)
    } else if (localUser) {
      // Fall back to local storage user
      currentUser.value = localUser
      console.log('Local storage user detected:', currentUser.value)
    } else {
      // No user found
      currentUser.value = null
    }
    isCheckingAuth.value = false
  })

  setTimeout(() => {
    initializeMapbox()
  }, 1000)

  // Clean up the listener on unmount
  onUnmounted(() => {
    unsubscribe()
    // Cleanup mapbox
    locationSuggestions.value = []
    if (map.value) {
      map.value.remove()
    }
  })
})
</script>

<style scoped>
/* Color variables */
:root {
  --primary-color: #000000;
  --primary-hover: #333333;
  --border-color: #e9ecef;
}

.bg-gradient-light {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)),
              url('/backgroundactivity.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 4px;
}

.skip-link:focus {
  top: 0;
}

/* Form Labels - White Text */
.form-label {
  color: white !important;
}

/* Form Controls */
.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.25);
}

/* Buttons */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Location Suggestions */
.list-group-item:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

/* Map */
.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#map {
  border: 2px solid var(--border-color);
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .display-4 {
    font-size: 2rem;
  }
}
</style>
