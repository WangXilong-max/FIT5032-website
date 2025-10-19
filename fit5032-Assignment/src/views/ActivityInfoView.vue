<template>
  <section class="py-5 bg-gradient-light">
    <div class="container py-5">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading activity details...</span>
        </div>
        <p class="mt-3">Loading activity information...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h4><i class="bi bi-exclamation-triangle me-2"></i>Error</h4>
        <p>{{ error }}</p>
        <router-link to="/activities" class="btn btn-primary">Back to Activities</router-link>
      </div>

      <!-- Activity Details -->
      <div v-else-if="activity">
        <!-- Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="display-5 fw-bold text-white mb-2">{{ activity.name }}</h1>
                <div class="d-flex gap-2 mb-3">
                  <span class="badge bg-primary">{{ activity.category }}</span>
                  <span class="badge bg-success" v-if="activity.price === 0">Free</span>
                  <span class="badge bg-warning text-dark" v-else>${{ activity.price }}</span>
                </div>
              </div>
              <router-link to="/activities" class="btn btn-light">
                <i class="bi bi-arrow-left me-2"></i>Back
              </router-link>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Left Column - Activity Information -->
          <div class="col-lg-6">
            <div class="card shadow-lg h-100">
              <div class="card-body">
                <h3 class="card-title mb-4">
                  <i class="bi bi-info-circle me-2"></i>Activity Details
                </h3>

                <!-- Description -->
                <div class="mb-4">
                  <h5 class="text-muted mb-2">Description</h5>
                  <p class="lead">{{ activity.description || 'No description provided' }}</p>
                </div>

                <!-- Date & Time -->
                <div class="row mb-4">
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-calendar3 text-primary fs-4 me-3"></i>
                      <div>
                        <small class="text-muted d-block">Date</small>
                        <strong>{{ activity.date }}</strong>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-clock text-primary fs-4 me-3"></i>
                      <div>
                        <small class="text-muted d-block">Time</small>
                        <strong>{{ activity.time }}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location -->
                <div class="mb-4">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-geo-alt text-primary fs-4 me-3"></i>
                    <div>
                      <small class="text-muted d-block">Location</small>
                      <strong>{{ activity.location }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Participants -->
                <div class="mb-4">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-people text-primary fs-4 me-3"></i>
                      <div>
                        <small class="text-muted d-block">Participants</small>
                        <strong>{{ activity.participantCount || 0 }} / {{ activity.maxParticipants }}</strong>
                      </div>
                    </div>
                    <div class="progress" style="width: 150px; height: 8px;">
                      <div
                        class="progress-bar"
                        :class="getProgressBarClass()"
                        :style="{ width: getParticipantPercentage() + '%' }"
                      ></div>
                    </div>
                  </div>
                  <!-- Show participant emails if user is joined or is creator -->
                  <div v-if="isUserJoined || (currentUser && currentUser.uid === activity.creatorId)" class="mt-2">
                    <div class="card card-body bg-light p-2">
                      <div class="fw-bold mb-1">Participant Emails:</div>
                      <ul class="mb-0 ps-3">
                        <li v-for="p in participants" :key="p.userId">
                          <span>{{ p.email }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Organizer Info -->
                <div class="alert alert-info">
                  <h6 class="mb-2"><i class="bi bi-person-badge me-2"></i>Organizer</h6>
                  <p class="mb-1"><strong>{{ activity.creatorName || 'Unknown' }}</strong></p>
                  <p class="mb-0 small text-muted">{{ activity.creatorEmail || 'No email provided' }}</p>
                </div>

                <!-- Action Button -->
                <div class="d-grid" v-if="currentUser && currentUser.uid !== activity.creatorId">
                  <button
                    v-if="isUserJoined"
                    class="btn btn-danger btn-lg"
                    @click="handleLeaveActivity"
                    :disabled="actionLoading"
                  >
                    <i class="bi bi-box-arrow-right me-2"></i>
                    {{ actionLoading ? 'Leaving...' : 'Leave Activity' }}
                  </button>
                  <button
                    v-else
                    class="btn btn-primary btn-lg"
                    @click="handleJoinActivity"
                    :disabled="actionLoading || isFull"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    {{ actionLoading ? 'Joining...' : isFull ? 'Activity Full' : 'Join Activity' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Map -->
          <div class="col-lg-6">
            <div class="card shadow-lg h-100">
              <div class="card-body p-0">
                <!-- Map Container -->
                <div id="map" style="height: 600px; width: 100%; position: relative;">
                  <!-- No Location Message -->
                  <div
                    v-if="!activity.coordinates && !activity.latitude"
                    class="d-flex align-items-center justify-content-center h-100 bg-light"
                  >
                    <div class="text-center p-4">
                      <i class="bi bi-geo-alt-fill text-muted" style="font-size: 3rem;"></i>
                      <p class="text-muted mt-3 mb-0">No location data available for this activity</p>
                      <small class="text-muted">The activity organizer didn't set a location</small>
                    </div>
                  </div>
                </div>

                <!-- Map Controls -->
                <div class="p-3" v-if="activity.coordinates || activity.latitude">
                  <button
                    class="btn btn-primary w-100"
                    @click="showDirections"
                    :disabled="!userLocation"
                  >
                    <i class="bi bi-signpost-2 me-2"></i>
                    {{ userLocation ? 'Show Directions' : 'Getting your location...' }}
                  </button>
                  <small class="text-muted d-block mt-2 text-center">
                    Click on the activity marker to see the route from your location
                  </small>
                </div>
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
import { sendActivityBookingNotification } from '@/utils/emailService'
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
      return activity.value.participants?.includes(currentUser.value.uid) || false
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
        console.log('Activity loaded:', data)

        // Fetch participant details
        try {
          const participantList = await (await import('@/firebase/database')).getActivityParticipants(activityId.value)
          participants.value = participantList
        } catch {
          participants.value = []
        }

        // Check for coordinates in different formats
        if (data.coordinates) {
          console.log('Found coordinates array:', data.coordinates)
        } else if (data.longitude && data.latitude) {
          // Convert longitude/latitude to coordinates array [lng, lat]
          data.coordinates = [data.longitude, data.latitude]
          console.log('Converted lat/lng to coordinates:', data.coordinates)
        } else {
          console.warn('No coordinates found for this activity')
        }

        // Initialize map after activity is loaded and DOM is ready
        await nextTick()

        if (data.coordinates) {
          setTimeout(() => {
            initMap()
          }, 100)
        } else {
          console.warn('Activity has no coordinates, map will not be initialized')
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
        console.warn('Cannot initialize map: no coordinates')
        console.log('Activity data:', activity.value)

        // Use default Melbourne coordinates as fallback
        if (activity.value) {
          activity.value.coordinates = [144.9631, -37.8136]
          console.log('Using default Melbourne coordinates as fallback')
        } else {
          return
        }
      }

      try {
        console.log('Initializing map with coordinates:', activity.value.coordinates)
        console.log('Coordinate type:', typeof activity.value.coordinates)
        console.log('Is array:', Array.isArray(activity.value.coordinates))
        console.log('Coordinate values:', activity.value.coordinates[0], activity.value.coordinates[1])

        mapboxgl.accessToken = MAPBOX_TOKEN

        // Check if map container exists
        const mapContainer = document.getElementById('map')
        if (!mapContainer) {
          console.error('Map container not found in DOM')
          return
        }

        console.log('Map container found, width:', mapContainer.offsetWidth, 'height:', mapContainer.offsetHeight)

        // Ensure coordinates are numbers
        const lng = parseFloat(activity.value.coordinates[0])
        const lat = parseFloat(activity.value.coordinates[1])

        if (isNaN(lng) || isNaN(lat)) {
          console.error('Invalid coordinates:', { lng, lat })
          return
        }

        console.log('Parsed coordinates:', { lng, lat })

        map.value = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 13
        })

        console.log('Map instance created')

        // Add navigation controls
        map.value.addControl(new mapboxgl.NavigationControl())

        // Wait for map to load before adding markers
        map.value.on('load', () => {
          console.log('Map loaded successfully')

          // Add activity marker
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

          console.log('Activity marker added at:', lng, lat)

          // Add click event to show directions
          el.addEventListener('click', () => {
            showDirections()
          })

          // Get user location
          getUserLocation()
        })

        map.value.on('error', (e) => {
          console.error('Map error:', e.error || e)
        })
      } catch (err) {
        console.error('Error initializing map:', err)
        console.error('Error stack:', err.stack)
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
        const success = await joinActivity(activityId.value, currentUser.value.uid)

        if (success) {
          // Send email notification to organizer
          await sendActivityBookingNotification({
            organizerEmail: activity.value.creatorEmail,
            organizerName: activity.value.creatorEmail,
            activityName: activity.value.name,
            participantName: currentUser.value.email,
            participantEmail: currentUser.value.email,
            activityDate: activity.value.date,
            activityTime: activity.value.time,
            activityLocation: activity.value.location
          })

          alert('Successfully joined the activity! The organizer has been notified.')
          await loadActivity() // Reload activity data
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
        const success = await leaveActivity(activityId.value, currentUser.value.uid)

        if (success) {
          alert('Successfully left the activity')
          await loadActivity() // Reload activity data
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
