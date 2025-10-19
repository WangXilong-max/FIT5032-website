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
            <i class="bi bi-person me-1"></i>{{ event.participants }}/{{ event.maxParticipants }}
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
          <small class="text-muted d-block mb-1">Rate this event:</small>
          <div>
            <i v-for="n in 5" :key="n"
               :class="n <= currentRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
               @click="handleRate(n)"
               style="cursor: pointer; font-size: 1rem; margin: 0 1px;"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer bg-transparent">
      <button class="btn btn-primary btn-sm w-100">
        <i class="bi bi-person-plus me-1"></i>Join Event
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  event: Object
})

const emit = defineEmits(['delete', 'rate'])

const currentRating = ref(0)

const handleRate = (rating) => {
  currentRating.value = rating
  emit('rate', props.event.id, rating)
}
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
