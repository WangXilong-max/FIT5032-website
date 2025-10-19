<template>
  <section id="admin" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Admin Panel</h2>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Users Management</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.username }}</td>
                      <td>{{ user.role }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Events Management</h5>
            </div>
            <div class="card-body">
              <p>Total Events: {{ events.length }}</p>
              <p v-if="events.length > 0">Average Rating: {{ averageRating }}</p>
              <div v-if="topEvents.length > 0" class="mb-3">
                <h6>Top Rated Events:</h6>
                <div v-for="event in topEvents" :key="event.id" class="small">
                  {{ event.name }}: {{ event.averageRating.toFixed(1) }} ⭐ ({{ event.ratings.length }} reviews)
                </div>
              </div>
              <button class="btn btn-danger btn-sm" @click="$emit('clear-events')">
                Clear All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  users: Array,
  events: Array
})

defineEmits(['clear-events'])

const averageRating = computed(() => {
  if (props.events.length === 0) return 0
  const total = props.events.reduce((sum, e) => sum + (e.averageRating || 0), 0)
  return (total / props.events.length).toFixed(1)
})

const topEvents = computed(() => {
  return props.events
    .filter(e => e.ratings && e.ratings.length > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3)
})
</script>
