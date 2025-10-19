<template>
  <div class="my-activities-page">
    <div class="container py-5">
      <!-- Page Title -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold">My Activities</h1>
        <p class="lead text-muted">Manage and view your sports activities</p>
      </div>

      <!-- Check if user is logged in -->
      <div v-if="!user" class="alert alert-warning text-center">
        <h4>Please Log In</h4>
        <p>You need to be logged in to view your activities.</p>
        <router-link to="/signin" class="btn btn-primary">Sign In</router-link>
      </div>

      <!-- User is logged in -->
      <div v-else>
        <!-- Statistics Cards -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="stat-card">
              <h3>{{ myCreatedActivities.length }}</h3>
              <p>Created</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h3>{{ myJoinedActivities.length }}</h3>
              <p>Joined</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h3>{{ totalActivities }}</h3>
              <p>Total</p>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Calendar View</h5>
          </div>
          <div class="card-body">
            <FullCalendar :options="calendarOptions" />
          </div>
        </div>

        <!-- Activity Lists -->
        <div class="row">
          <!-- Created Activities -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">My Created Activities</h5>
              </div>
              <div class="card-body">
                <div v-if="myCreatedActivities.length === 0" class="text-center text-muted py-4">
                  <p>No activities created yet</p>
                  <router-link to="/create-activity" class="btn btn-primary btn-sm">
                    Create Activity
                  </router-link>
                </div>
                <div v-else class="activity-list">
                  <div
                    v-for="activity in myCreatedActivities"
                    :key="activity.id"
                    class="activity-item mb-3"
                  >
                    <h6 class="fw-bold">{{ activity.name }}</h6>
                    <p class="text-muted mb-1">
                      <i class="bi bi-calendar"></i> {{ activity.date }} at {{ activity.time }}
                    </p>
                    <p class="text-muted mb-1">
                      <i class="bi bi-geo-alt"></i> {{ activity.location }}
                    </p>
                    <span class="badge bg-primary">{{ activity.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Joined Activities -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Joined Activities</h5>
              </div>
              <div class="card-body">
                <div v-if="myJoinedActivities.length === 0" class="text-center text-muted py-4">
                  <p>No activities joined yet</p>
                  <router-link to="/activities" class="btn btn-success btn-sm">
                    Browse Activities
                  </router-link>
                </div>
                <div v-else class="activity-list">
                  <div
                    v-for="activity in myJoinedActivities"
                    :key="activity.id"
                    class="activity-item mb-3"
                  >
                    <h6 class="fw-bold">{{ activity.name }}</h6>
                    <p class="text-muted mb-1">
                      <i class="bi bi-calendar"></i> {{ activity.date }} at {{ activity.time }}
                    </p>
                    <p class="text-muted mb-1">
                      <i class="bi bi-geo-alt"></i> {{ activity.location }}
                    </p>
                    <span class="badge bg-success">{{ activity.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { STORAGE_KEYS, loadFromLocalStorage } from '../utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

// State
const user = ref(null)

// Calendar options
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  events: [],
  height: 'auto'
})

// Computed
const myCreatedActivities = computed(() => {
  if (!user.value || !props.events) return []
  return props.events.filter(event => event.creatorId === user.value.id)
})

const myJoinedActivities = computed(() => {
  if (!user.value || !props.events) return []
  return props.events.filter(event => {
    const isParticipant = event.participants?.includes(user.value.id)
    const notCreator = event.creatorId !== user.value.id
    return isParticipant && notCreator
  })
})

const totalActivities = computed(() => {
  return myCreatedActivities.value.length + myJoinedActivities.value.length
})

const calendarEvents = computed(() => {
  const allMyActivities = [...myCreatedActivities.value, ...myJoinedActivities.value]
  return allMyActivities.map(activity => ({
    id: activity.id,
    title: activity.name,
    date: activity.date,
    backgroundColor: myCreatedActivities.value.includes(activity) ? '#0d6efd' : '#198754'
  }))
})

// Methods
const loadUser = () => {
  // Check local storage first
  const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)
  if (localUser) {
    user.value = localUser
  }

  // Check Firebase
  onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email
      }
    } else if (!localUser) {
      user.value = null
    }
  })
}

const updateCalendar = () => {
  calendarOptions.value.events = calendarEvents.value
}

// Lifecycle
onMounted(() => {
  loadUser()
  updateCalendar()
})

// Watch for changes and update calendar
watch(() => props.events, () => {
  updateCalendar()
}, { deep: true })

watch(() => user.value, () => {
  updateCalendar()
}, { deep: true })

watch(() => calendarEvents.value, () => {
  updateCalendar()
}, { deep: true })
</script>

<style scoped>
.my-activities-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-top: 80px;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0d6efd;
  margin-bottom: 0.5rem;
}

.stat-card p {
  color: #6c757d;
  margin: 0;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.activity-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
}

.activity-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  transition: all 0.3s ease;
}

.activity-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
