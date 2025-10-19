<template>
  <div class="card event-card h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <span class="badge bg-dark text-white rounded-pill">{{ event.category }}</span>
        <span class="badge bg-dark text-white rounded-pill ms-2" v-if="event.status === 'upcoming'">Upcoming</span>
        <span class="badge bg-dark text-white rounded-pill ms-2" v-else-if="event.status === 'ongoing'">Ongoing</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <small class="text-muted">
          <i class="bi bi-calendar me-1"></i>{{ event.date }}
        </small>
        <button class="btn btn-outline-danger btn-sm"
                @click="$emit('delete', event.id)"
                title="Delete Event">
          <i class="bi bi-trash"></i>
        </button>
      </div>
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
          <small class="text-primary fw-bold">
            <i class="bi bi-currency-dollar me-1"></i>{{ event.price === 0 ? 'Free' : `$${event.price}` }}
          </small>
        </div>
        <div class="col-6">
          <small class="text-muted">
            <i class="bi bi-person me-1"></i>{{ event.participantCount || 0 }}/{{ event.maxParticipants }}
          </small>
        </div>
      </div>

      <div class="mb-3" v-if="event.ratings && event.ratings.length > 0">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <span class="me-2">
              <i v-for="n in 5" :key="n"
                 :class="n <= Math.round(event.averageRating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                 style="font-size: 0.8rem;"></i>
            </span>
            <small class="text-muted">{{ event.averageRating.toFixed(1) }}</small>
          </div>
          <small class="text-muted">({{ event.ratings.length }} reviews)</small>
        </div>
      </div>

      <div class="mb-3">
        <div class="text-center">
          <small class="text-muted d-block mb-1">
            {{ hasUserRated ? 'Your rating (click to update):' : 'Rate this event:' }}
          </small>
          <div>
            <i v-for="n in 5" :key="n"
               :class="n <= currentRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
               @click="handleRate(n)"
               style="cursor: pointer; font-size: 1rem; margin: 0 1px;"></i>
          </div>
          <small v-if="hasUserRated" class="text-success d-block mt-1">
            <i class="bi bi-check-circle"></i> You rated this {{ currentRating }} star{{ currentRating > 1 ? 's' : '' }}
          </small>
        </div>
      </div>
    </div>
    <div class="card-footer bg-transparent">
      <!-- Join/Leave button - only show if user is logged in and activity is not full -->
      <div v-if="currentUser">
        <!-- Creator view - just show status -->
        <div v-if="isCreator">
          <button class="btn btn-secondary btn-sm w-100" disabled>
            <i class="bi bi-person-check me-1"></i>Your Event ({{ event.participantCount || 0 }}/{{ event.maxParticipants }})
          </button>
        </div>
        <!-- Non-creator buttons -->
        <div v-else>
          <button
            v-if="!isUserJoined && !isActivityFull"
            class="btn btn-success btn-sm w-100"
            @click="joinEvent"
          >
            <i class="bi bi-person-plus me-1"></i>Join Event
          </button>
          <button
            v-else-if="isUserJoined"
            class="btn btn-outline-danger btn-sm w-100"
            @click="leaveEvent"
          >
            <i class="bi bi-person-dash me-1"></i>Leave Event
          </button>
          <button
            v-else-if="isActivityFull"
            class="btn btn-secondary btn-sm w-100"
            disabled
          >
            <i class="bi bi-people-fill me-1"></i>Event Full
          </button>
        </div>
      </div>
      <!-- Not logged in message -->
      <div v-else>
        <router-link to="/signin" class="btn btn-outline-primary btn-sm w-100">
          <i class="bi bi-box-arrow-in-right me-1"></i>Sign In to Join
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { STORAGE_KEYS, loadFromLocalStorage } from '../utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'

const props = defineProps({
  event: Object
})

const emit = defineEmits(['delete', 'rate', 'join', 'leave'])

const currentRating = ref(0)
const currentUser = ref(null)

// Check if current user has already rated this activity
const getUserRating = () => {
  if (!currentUser.value || !props.event.ratings) return 0

  const userRating = props.event.ratings.find(r => r.userId === currentUser.value.id)
  return userRating ? userRating.rating : 0
}

// Computed properties
const isUserJoined = computed(() => {
  return props.event.participants?.includes(currentUser.value?.id) || false
})

const hasUserRated = computed(() => {
  if (!currentUser.value || !props.event.ratings) return false
  return props.event.ratings.some(r => r.userId === currentUser.value.id)
})

const isActivityFull = computed(() => {
  return (props.event.participantCount || 0) >= props.event.maxParticipants
})

const isCreator = computed(() => {
  return props.event.creatorId === currentUser.value?.id
})

// Methods
const handleRate = (rating) => {
  currentRating.value = rating
  emit('rate', props.event.id, rating)
}

const joinEvent = () => {
  if (!currentUser.value) return

  // Just emit to parent, let parent handle the update
  emit('join', props.event.id)
}

const leaveEvent = () => {
  if (!currentUser.value) return

  // Just emit to parent, let parent handle the update
  emit('leave', props.event.id)
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
      console.log('Firebase user detected in EventCard:', firebaseUser.email)
      // Load user's existing rating
      currentRating.value = getUserRating()
    } else if (localUser) {
      // Fall back to local storage user
      currentUser.value = localUser
      console.log('Local storage user detected in EventCard:', currentUser.value)
      // Load user's existing rating
      currentRating.value = getUserRating()
    } else {
      // No user found
      currentUser.value = null
      currentRating.value = 0
    }
  })

  // Clean up the listener on unmount
  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
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
</style>
