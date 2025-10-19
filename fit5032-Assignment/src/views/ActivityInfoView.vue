<template>
  <section class="py-4">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h4>Error</h4>
        <p>{{ error }}</p>
        <router-link to="/activities" class="btn btn-primary">Back</router-link>
      </div>

      <!-- Activity Details -->
      <div v-else-if="activity">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 class="h2 fw-bold mb-2">{{ activity.name }}</h1>
            <div class="d-flex gap-2">
              <span class="badge bg-primary">{{ activity.category }}</span>
              <span class="badge" :class="activity.price === 0 ? 'bg-success' : 'bg-warning text-dark'">
                {{ activity.price === 0 ? 'Free' : `$${activity.price}` }}
              </span>
            </div>
          </div>
          <router-link to="/activities" class="btn btn-sm btn-outline-primary">Back</router-link>
        </div>

        <div class="row g-3">
          <!-- Left Column -->
          <div class="col-lg-6">
            <div class="border rounded p-3">
              <p class="text-muted mb-2">{{ activity.description || 'No description' }}</p>

              <div class="row g-2 text-sm mb-3">
                <div class="col-6">
                  <small class="text-muted d-block">Date</small>
                  <strong>{{ activity.date }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Time</small>
                  <strong>{{ activity.time }}</strong>
                </div>
              </div>

              <div class="mb-3">
                <small class="text-muted d-block">Location</small>
                <strong>{{ activity.location }}</strong>
              </div>

              <div class="mb-3">
                <small class="text-muted d-block">Participants</small>
                <strong>{{ activity.participantCount || 0 }} / {{ activity.maxParticipants }}</strong>
                <div class="progress mt-1" style="height: 6px;">
                  <div
                    class="progress-bar"
                    :class="getProgressBarClass()"
                    :style="{ width: getParticipantPercentage() + '%' }"
                  ></div>
                </div>
              </div>

              <div v-if="isUserJoined || (currentUser && currentUser.id === activity.creatorId)" class="bg-light p-2 rounded mb-3">
                <small class="fw-bold d-block mb-1">Participants:</small>
                <div style="font-size: 0.85rem;">
                  <div v-for="p in participants" :key="p.userId">{{ p.email }}</div>
                </div>
              </div>

              <div class="bg-light p-2 rounded mb-3">
                <small class="fw-bold d-block mb-1">Organizer</small>
                <small>{{ activity.creatorName || 'Unknown' }}</small><br>
                <small class="text-muted">{{ activity.creatorEmail }}</small>
              </div>

              <div v-if="currentUser && currentUser.id !== activity.creatorId" class="d-grid">
                <button
                  v-if="isUserJoined"
                  class="btn btn-outline-danger btn-sm"
                  @click="handleLeaveActivity"
                  :disabled="actionLoading"
                  aria-label="Leave this activity"
                >
                  {{ actionLoading ? 'Leaving...' : 'Leave' }}
                </button>
                <button
                  v-else
                  class="btn btn-primary btn-sm"
                  @click="handleJoinActivity"
                  :disabled="actionLoading || isFull"
                  aria-label="Join this activity"
                >
                  {{ actionLoading ? 'Joining...' : isFull ? 'Full' : 'Join' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Map -->
          <div class="col-lg-6">
            <div class="border rounded overflow-hidden">
              <div id="map" style="height: 400px; width: 100%;">
                <div
                  v-if="!activity.coordinates && !activity.latitude && !activity.longitude"
                  class="d-flex align-items-center justify-content-center h-100 bg-light"
                >
                  <div class="text-center text-muted">
                    <small>No location data</small>
                  </div>
                </div>
              </div>
              <div v-if="activity.coordinates || activity.latitude" class="p-2">
                <button
                  class="btn btn-primary btn-sm w-100"
                  @click="showDirections"
                  :disabled="!userLocation"
                >
                  {{ userLocation ? 'Directions' : 'Getting location...' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getActivityById, joinActivity, leaveActivity } from '@/firebase/database'
import { onAuthStateChange } from '@/firebase/auth'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_ACCESS_TOKEN } from '@/config/mapbox'

export default {
  name: 'ActivityInfoView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // State
  const activity = ref(null)
  const participants = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentUser = ref(null)
    const actionLoading = ref(false)
    const userLocation = ref(null)
    const map = ref(null)
    const userMarker = ref(null)
    const activityMarker = ref(null)
    const directionsLayer = ref(null)

    const MAPBOX_TOKEN = MAPBOX_ACCESS_TOKEN

    // Computed
    const activityId = computed(() => route.params.id)

    const isUserJoined = computed(() => {
      if (!currentUser.value || !activity.value) return false
      return activity.value.participants?.includes(currentUser.value.id) || false
    })

    const isFull = computed(() => {
      if (!activity.value) return false
      return (activity.value.participantCount || 0) >= activity.value.maxParticipants
    })

    const getParticipantPercentage = () => {
      if (!activity.value) return 0
      return Math.round(((activity.value.participantCount || 0) / activity.value.maxParticipants) * 100)
    }

    const getProgressBarClass = () => {
      const percentage = getParticipantPercentage()
      if (percentage >= 90) return 'bg-danger'
      if (percentage >= 70) return 'bg-warning'
      return 'bg-success'
    }

    // Methods
    const loadActivity = async () => {
      try {
        loading.value = true
        error.value = null
        const data = await getActivityById(activityId.value)

        if (!data) {
          error.value = 'Activity not found'
          return
        }

        activity.value = data

        // Fetch participant details
        try {
          const participantList = await (await import('@/firebase/database')).getActivityParticipants(activityId.value)
          participants.value = participantList
        } catch {
          participants.value = []
        }

        // Check for coordinates in different formats
        if (data.coordinates) {
        } else if (data.longitude && data.latitude) {
          // Convert longitude/latitude to coordinates array [lng, lat]
          data.coordinates = [data.longitude, data.latitude]
        } else {
        }

        // Initialize map after activity is loaded and DOM is ready
        await nextTick()

        if (data.coordinates) {
          setTimeout(() => {
            initMap()
          }, 100)
        } else {
        }
      } catch (err) {
        console.error('Error loading activity:', err)
        error.value = 'Failed to load activity details'
      } finally {
        loading.value = false
      }
    }

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lng: position.coords.longitude,
              lat: position.coords.latitude
            }
            if (map.value) {
              addUserMarker()
            }
          },
          (error) => {
            console.error('Error getting user location:', error)
          }
        )
      }
    }

    const initMap = () => {
      if (!activity.value?.coordinates) {
        if (activity.value) {
          activity.value.coordinates = [144.9631, -37.8136]
        } else {
          return
        }
      }

      try {
        mapboxgl.accessToken = MAPBOX_TOKEN

        const mapContainer = document.getElementById('map')
        if (!mapContainer) {
          return
        }

        const lng = parseFloat(activity.value.coordinates[0])
        const lat = parseFloat(activity.value.coordinates[1])

        if (isNaN(lng) || isNaN(lat)) {
          return
        }

        map.value = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 13
        })

        map.value.addControl(new mapboxgl.NavigationControl())

        map.value.on('load', () => {
          const el = document.createElement('div')
          el.className = 'custom-marker'
          el.style.backgroundColor = '#dc3545'
          el.style.width = '30px'
          el.style.height = '30px'
          el.style.borderRadius = '50%'
          el.style.cursor = 'pointer'
          el.style.border = '3px solid white'
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

          activityMarker.value = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h6>${activity.value.name}</h6>
                  <p class="mb-0 small">${activity.value.location}</p>
                `)
            )
            .addTo(map.value)

          el.addEventListener('click', () => {
            showDirections()
          })

          getUserLocation()
        })

        map.value.on('error', (e) => {
          console.error('Map error:', e.error || e)
        })
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    }

    const addUserMarker = () => {
      if (!map.value || !userLocation.value) return

      // Remove existing user marker
      if (userMarker.value) {
        userMarker.value.remove()
      }

      // Add user location marker
      userMarker.value = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.value.lng, userLocation.value.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<p class="mb-0 small">Your Location</p>'))
        .addTo(map.value)
    }

    const showDirections = async () => {
      if (!userLocation.value || !activity.value?.coordinates || !map.value) return

      try {
        // Remove existing directions layer
        if (directionsLayer.value && map.value.getLayer('route')) {
          map.value.removeLayer('route')
          map.value.removeSource('route')
          directionsLayer.value = null
        }

        // Get directions from Mapbox Directions API
        const start = `${userLocation.value.lng},${userLocation.value.lat}`
        const end = `${activity.value.coordinates[0]},${activity.value.coordinates[1]}`
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${MAPBOX_TOKEN}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry

          // Add route to map
          map.value.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          })

          map.value.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 5,
              'line-opacity': 0.75
            }
          })

          directionsLayer.value = true

          // Fit map to show both markers and route
          const bounds = new mapboxgl.LngLatBounds()
          bounds.extend([userLocation.value.lng, userLocation.value.lat])
          bounds.extend(activity.value.coordinates)

          map.value.fitBounds(bounds, { padding: 100 })

          // Show distance and duration
          const distance = (data.routes[0].distance / 1000).toFixed(1)
          const duration = Math.round(data.routes[0].duration / 60)
          alert(`Distance: ${distance} km\nEstimated time: ${duration} minutes`)
        }
      } catch (error) {
        console.error('Error fetching directions:', error)
        alert('Failed to get directions. Please try again.')
      }
    }

    const handleJoinActivity = async () => {
      if (!currentUser.value) {
        router.push('/signin')
        return
      }

      if (isFull.value) {
        alert('This activity is already full')
        return
      }

      try {
        actionLoading.value = true
        const success = await joinActivity(activityId.value, currentUser.value.id)

        if (success) {
          // Removed sendActivityBookingNotification
          alert('Successfully joined the activity! The organizer has been notified.')
          await loadActivity()
        } else {
          alert('Failed to join activity. Please try again.')
        }
      } catch (err) {
        console.error('Error joining activity:', err)
        alert('An error occurred. Please try again.')
      } finally {
        actionLoading.value = false
      }
    }

    const handleLeaveActivity = async () => {
      if (!currentUser.value) return

      if (!confirm('Are you sure you want to leave this activity?')) return

      try {
        actionLoading.value = true
        const success = await leaveActivity(activityId.value, currentUser.value.id)

        if (success) {
          alert('Successfully left the activity')
          await loadActivity()
        } else {
          alert('Failed to leave activity. Please try again.')
        }
      } catch (err) {
        console.error('Error leaving activity:', err)
        alert('An error occurred. Please try again.')
      } finally {
        actionLoading.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      // Listen for auth state changes
      onAuthStateChange((user) => {
        currentUser.value = user
      })

      loadActivity()
    })

    onUnmounted(() => {
      // Clean up map
      if (map.value) {
        map.value.remove()
      }
    })

    return {
      activity,
      loading,
      error,
      currentUser,
      actionLoading,
      userLocation,
      isUserJoined,
      isFull,
      getParticipantPercentage,
      getProgressBarClass,
      handleJoinActivity,
      handleLeaveActivity,
      showDirections,
      participants
    }
  }
}
</script>

<style scoped>
.bg-gradient-light {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
}

#map {
  position: relative;
  background: #e5e5e5;
}

.custom-marker {
  cursor: pointer;
}

.custom-marker:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>
