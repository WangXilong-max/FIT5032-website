<template>
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
              @delete="$emit('delete', $event)"
              @rate="$emit('rate', $event)"
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
import EventCard from '../components/EventCard.vue'

defineProps({
  events: Array
})

defineEmits(['delete', 'rate'])
</script><style scoped>
.bg-gradient-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
