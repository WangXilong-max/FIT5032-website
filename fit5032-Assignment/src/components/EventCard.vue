<template>
  <div class="card event-card h-100">
    <div class="card-header d-flex justify-content-between align-items-start">
      <div>
        <span class="badge bg-dark text-white rounded-pill" style="font-size: 0.7rem">{{
          event.category
        }}</span>
      </div>
      <small class="text-muted" style="font-size: 0.75rem">{{ event.date }}</small>
      <button
        v-if="isCreator"
        class="btn btn-outline-danger btn-xs p-1"
        @click="$emit('delete', event.id)"
        aria-label="Delete event"
        title="Delete this event"
        style="font-size: 0.65rem"
      >
        <i class="bi bi-trash" aria-hidden="true" style="font-size: 0.75rem"></i>
      </button>
    </div>
    <div class="card-body pb-2">
      <h6 class="card-title fw-bold mb-1">{{ event.name }}</h6>
      <p class="card-text text-muted" style="font-size: 0.85rem; margin-bottom: 0.5rem">
        {{ event.description }}
      </p>

      <div
        style="font-size: 0.8rem; margin-bottom: 0.5rem"
        role="region"
        aria-label="Event details"
      >
        <small class="text-muted d-block">
          <i class="bi bi-clock me-1" aria-hidden="true"></i><span>Time: {{ event.time }}</span>
        </small>
        <small class="text-muted d-block">
          <i class="bi bi-geo-alt me-1" aria-hidden="true"></i
          ><span>Location: {{ event.location }}</span>
        </small>
        <small class="text-muted d-block">
          <i class="bi bi-person me-1" aria-hidden="true"></i>
          <span>Participants: {{ event.participantCount || 0 }}/{{ event.maxParticipants }}</span>
        </small>
      </div>

      <div class="mb-2" v-if="event.ratings && event.ratings.length > 0">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <span class="me-1">
              <i
                v-for="n in 5"
                :key="n"
                :class="
                  n <= Math.round(event.averageRating)
                    ? 'bi bi-star-fill text-warning'
                    : 'bi bi-star text-muted'
                "
                style="font-size: 0.7rem"
              ></i>
            </span>
            <small class="text-muted" style="font-size: 0.75rem">{{
              event.averageRating.toFixed(1)
            }}</small>
          </div>
          <small class="text-muted" style="font-size: 0.75rem">({{ event.ratings.length }})</small>
        </div>
      </div>

      <div class="mb-2">
        <small class="text-muted d-block mb-1" style="font-size: 0.75rem">
          {{ currentUser ? (hasUserRated ? 'You rated:' : 'Rate:') : 'Login to rate' }}
        </small>
        <div style="font-size: 0.9rem">
          <i
            v-for="n in 5"
            :key="n"
            :class="n <= currentRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
            @click="handleRate(n)"
            :aria-label="`Rate ${n} stars`"
            role="button"
            tabindex="0"
            @keydown.enter="handleRate(n)"
            @keydown.space="handleRate(n)"
            :style="{
              cursor: currentUser ? 'pointer' : 'not-allowed',
              margin: '0 1px',
              opacity: currentUser ? '1' : '0.5',
            }"
          ></i>
        </div>
      </div>
    </div>
    <div class="card-footer bg-transparent border-top-0 pt-2">
      <!-- View Details Button -->
      <router-link
        :to="`/activities/${event.id}`"
        class="btn btn-outline-primary btn-sm w-100 mb-2"
        style="font-size: 0.85rem; padding: 0.4rem 0.75rem"
      >
        <i class="bi bi-arrow-right me-1"></i>Check Detail
      </router-link>

      <!-- Join/Leave button -->
      <div v-if="currentUser">
        <div v-if="isCreator">
          <button
            class="btn btn-secondary btn-sm w-100"
            disabled
            style="font-size: 0.8rem; padding: 0.35rem 0.75rem"
          >
            <i class="bi bi-person-check me-1"></i>{{ event.participantCount || 0 }}/{{
              event.maxParticipants
            }}
          </button>
        </div>
        <div v-else>
          <button
            v-if="isUserJoined"
            class="btn btn-outline-danger btn-sm w-100"
            @click="$emit('leave', event.id)"
            :disabled="actionLoading"
            style="font-size: 0.8rem; padding: 0.35rem 0.75rem"
          >
            <i class="bi bi-person-x me-1"></i>{{ actionLoading ? 'Leaving...' : 'Leave' }}
          </button>
          <button
            v-else
            class="btn btn-primary btn-sm w-100"
            @click="$emit('join', event.id)"
            :disabled="actionLoading || isFull"
            style="font-size: 0.8rem; padding: 0.35rem 0.75rem"
          >
            <i class="bi bi-person-plus me-1"></i
            >{{ actionLoading ? 'Joining...' : isFull ? 'Full' : 'Join' }}
          </button>
        </div>
      </div>
      <div v-else>
        <button
          class="btn btn-primary btn-sm w-100"
          disabled
          style="font-size: 0.8rem; padding: 0.35rem 0.75rem"
        >
          <i class="bi bi-lock me-1"></i>Login to Join
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { STORAGE_KEYS, loadFromLocalStorage } from '../utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'

const props = defineProps({
  event: Object,
})

const emit = defineEmits(['delete', 'rate', 'join', 'leave'])

const currentRating = ref(0)
const currentUser = ref(null)
const actionLoading = ref(false)

// Check if current user has already rated this activity
const getUserRating = () => {
  if (!currentUser.value || !props.event.ratings) return 0

  const userRating = props.event.ratings.find((r) => r.userId === currentUser.value.id)
  return userRating ? userRating.rating : 0
}

// Computed properties
const isUserJoined = computed(() => {
  return props.event.participants?.includes(currentUser.value?.id) || false
})

const hasUserRated = computed(() => {
  if (!currentUser.value || !props.event.ratings) return false
  return props.event.ratings.some((r) => r.userId === currentUser.value.id)
})

const isActivityFull = computed(() => {
  return (props.event.participantCount || 0) >= props.event.maxParticipants
})

const isCreator = computed(() => {
  return props.event.creatorId === currentUser.value?.id
})

const isFull = computed(() => {
  return isActivityFull.value
})

// Methods
const handleRate = (rating) => {
  if (!currentUser.value) {
    alert('Please sign in to rate this event')
    return
  }
  currentRating.value = rating
  emit('rate', props.event.id, rating)
}

// Lifecycle
onMounted(() => {
  // Check both local storage and Firebase authentication
  const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)

  // Set up Firebase auth state listener
  const unsubscribe = onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      currentUser.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email,
      }
      currentRating.value = getUserRating()
    } else if (localUser) {
      currentUser.value = localUser
      currentRating.value = getUserRating()
    } else {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.event-card .card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem;
}

.event-card .card-body {
  padding: 0.75rem;
}

.event-card .card-footer {
  padding: 0.5rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.35em 0.5em;
}

.btn-xs {
  padding: 0.2rem 0.4rem;
  font-size: 0.65rem;
}
</style>
