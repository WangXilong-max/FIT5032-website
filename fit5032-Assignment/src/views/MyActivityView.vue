<template>
  <div class="my-activities-page">
    <div class="container py-4 mt-4">
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
                    <p class="text-muted mb-2">
                      <i class="bi bi-people"></i> {{ activity.participantCount || 0 }}/{{
                        activity.maxParticipants
                      }}
                      participants
                    </p>
                    <div class="d-flex gap-2 align-items-center">
                      <span class="badge bg-primary">{{ activity.category }}</span>
                      <div class="ms-auto d-flex gap-2">
                        <button
                          class="btn btn-sm btn-dark text-white"
                          @click="viewDetails(activity.id)"
                          title="View activity details"
                        >
                          <i class="bi bi-eye me-1"></i>Check Details
                        </button>
                        <button
                          class="btn btn-sm btn-dark text-white"
                          @click="deleteActivity(activity)"
                          title="Delete this activity"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
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
                  <router-link to="/activities" class="btn btn-dark text-white btn-sm">
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
                    <p class="text-muted mb-2">
                      <i class="bi bi-people"></i> {{ activity.participantCount || 0 }}/{{
                        activity.maxParticipants
                      }}
                      participants
                    </p>
                    <div class="d-flex gap-2 align-items-center">
                      <span class="badge bg-success">{{ activity.category }}</span>
                      <button
                        class="btn btn-sm btn-info text-white ms-auto"
                        @click="viewDetails(activity.id)"
                        title="View activity details"
                      >
                        <i class="bi bi-eye me-1"></i>Check Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Participants Modal -->
    <ParticipantsModal
      ref="participantsModalRef"
      :activityId="selectedActivityId"
      :activityName="selectedActivityName"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { STORAGE_KEYS, loadFromLocalStorage } from '../utils/storage.js'
import { onAuthStateChange } from '@/firebase/auth'
import ParticipantsModal from '../components/ParticipantsModal.vue'
import { Modal } from 'bootstrap'

const router = useRouter()

// Props
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['delete'])

// State
const user = ref(null)
const participantsModalRef = ref(null)
const selectedActivityId = ref(null)
const selectedActivityName = ref('')

// Calendar options (handlers will be set after functions are defined)
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  },
  events: [],
  height: 'auto',
})

// Computed
const myCreatedActivities = computed(() => {
  if (!user.value || !props.events) return []
  return props.events.filter((event) => event.creatorId === user.value.id)
})

const myJoinedActivities = computed(() => {
  if (!user.value || !props.events) return []
  return props.events.filter((event) => {
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
  return allMyActivities.map((activity) => ({
    id: activity.id,
    title: activity.name,
    date: activity.date,
    backgroundColor: myCreatedActivities.value.includes(activity) ? '#0d6efd' : '#198754',
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
        displayName: firebaseUser.displayName || firebaseUser.email,
      }
    } else if (!localUser) {
      user.value = null
    }
  })
}

const updateCalendar = () => {
  calendarOptions.value.events = calendarEvents.value
}

const viewParticipants = (activity) => {
  selectedActivityId.value = activity.id
  selectedActivityName.value = activity.name

  // Show Bootstrap modal
  const modalElement = document.getElementById('participantsModal')
  if (modalElement) {
    const modal = new Modal(modalElement)
    modal.show()
  }
}

const viewDetails = (activityId) => {
  router.push(`/activities/${activityId}`)
}

const deleteActivity = (activity) => {
  // Emit delete event to parent component (App.vue)
  emit('delete', activity.id)
}

const handleDateClick = async (info) => {
  if (!user.value) return

  const clickedDate = info.dateStr
  
  // Find activities on this date
  const activitiesOnDate = [...myCreatedActivities.value, ...myJoinedActivities.value].filter(
    (activity) => activity.date === clickedDate,
  )

  if (activitiesOnDate.length === 0) {
    alert(`No activities scheduled on ${clickedDate}.\n\nClick "Create New Activity" to add one.`)
    return
  }

  // Check for conflicts on this date
  const conflicts = []
  for (let i = 0; i < activitiesOnDate.length; i++) {
    for (let j = i + 1; j < activitiesOnDate.length; j++) {
      const activity1 = activitiesOnDate[i]
      const activity2 = activitiesOnDate[j]

      const [hour1, min1] = activity1.time.split(':').map(Number)
      const [hour2, min2] = activity2.time.split(':').map(Number)

      const minutes1 = hour1 * 60 + min1
      const minutes2 = hour2 * 60 + min2
      const timeDiff = Math.abs(minutes1 - minutes2)

      if (timeDiff < 120) {
        conflicts.push({ activity1, activity2, timeDiff })
      }
    }
  }

  let message = `Activities on ${clickedDate}:\n\n`
  activitiesOnDate.forEach((activity, index) => {
    message += `${index + 1}. ${activity.name}\n   Time: ${activity.time}\n   Location: ${activity.location}\n\n`
  })

  if (conflicts.length > 0) {
    message += `\n⚠️ CONFLICT WARNING:\n\n`
    conflicts.forEach((conflict) => {
      const hoursDiff = Math.floor(conflict.timeDiff / 60)
      const minsDiff = conflict.timeDiff % 60
      message += `"${conflict.activity1.name}" (${conflict.activity1.time}) and "${conflict.activity2.name}" (${conflict.activity2.time}) are only ${hoursDiff}h ${minsDiff}m apart!\n\n`
    })
  } else if (activitiesOnDate.length > 1) {
    message += `✅ No conflicts detected. All activities are at least 2 hours apart.`
  }

  alert(message)
}

const handleEventClick = (info) => {
  const eventId = info.event.id
  viewDetails(eventId)
}

// Lifecycle
onMounted(() => {
  loadUser()
  updateCalendar()
  
  // Set calendar event handlers after functions are defined
  calendarOptions.value.dateClick = handleDateClick
  calendarOptions.value.eventClick = handleEventClick
})

// Watch for changes and update calendar
watch(
  () => props.events,
  () => {
    updateCalendar()
  },
  { deep: true },
)

watch(
  () => user.value,
  () => {
    updateCalendar()
  },
  { deep: true },
)

watch(
  () => calendarEvents.value,
  () => {
    updateCalendar()
  },
  { deep: true },
)
</script>

<style scoped>
.my-activities-page {
  min-height: 100vh;
  background: 
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('/myactivitybg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
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
