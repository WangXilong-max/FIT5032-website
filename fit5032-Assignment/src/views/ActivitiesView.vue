<template>
  <section id="activities" class="py-5 bg-gradient-light">
    <div class="container py-5">
      <div class="row mb-5">
        <div class="col-12">
          <div class="text-center mb-4">
            <h2 class="display-4 fw-bold text-white">Activity Display</h2>
            <p class="lead text-white">Following are the created activities</p>
            <router-link
              to="/create-activity"
              class="btn btn-primary btn-lg mt-3"
            >
              <i class="bi bi-plus-circle me-2"></i>Create New Activity
            </router-link>
          </div>
        </div>
      </div>
      <div>
        <div class="row g-4" v-if="events.length > 0">
          <div v-for="event in events" :key="event.id" class="col-lg-6">
            <EventCard
              :event="event"
              @delete="(eventId) => $emit('delete', eventId)"
              @rate="(eventId, rating) => $emit('rate', eventId, rating)"
              @join="(eventId) => $emit('join', eventId)"
              @leave="(eventId) => $emit('leave', eventId)"
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
</template>

<script setup>
import { onMounted } from 'vue'
import EventCard from '../components/EventCard.vue'

const props = defineProps({
  events: Array
})

// Define emits for parent component communication
defineEmits(['delete', 'rate', 'join', 'leave'])

onMounted(() => {
  console.log('ActivitiesView mounted, events received:', props.events?.length || 0)
  console.log('Events data:', props.events)
})
</script><style scoped>
.bg-gradient-light {
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
              url('/backgroundactivity.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

i.display-1 {
  font-size: 4rem;
  opacity: 0.3;
}

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
