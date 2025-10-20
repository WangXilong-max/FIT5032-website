<template>
  <div
    class="modal fade"
    id="participantsModal"
    tabindex="-1"
    aria-labelledby="participantsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="participantsModalLabel">
            <i class="bi bi-people-fill me-2"></i>Participants List
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading participants...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="participants.length === 0" class="text-center py-5">
            <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc"></i>
            <p class="text-muted mt-3">No participants yet</p>
          </div>

          <!-- Participants List -->
          <div v-else>
            <div class="mb-3">
              <p class="mb-0">
                <strong>{{ participants.length }}</strong> participant{{
                  participants.length > 1 ? 's' : ''
                }}
                registered
              </p>
            </div>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-dark">
                  <tr>
                    <th style="width: 50px">#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(participant, index) in participants" :key="participant.userId">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <i class="bi bi-person-circle me-2 text-primary"></i>
                      {{ participant.displayName }}
                    </td>
                    <td>{{ participant.email }}</td>
                    <td>
                      <small class="text-muted font-monospace"
                        >{{ participant.userId.substring(0, 8) }}...</small
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getActivityParticipants } from '@/firebase/database'

const props = defineProps({
  activityId: {
    type: String,
    default: null,
  },
  activityName: {
    type: String,
    default: 'Activity',
  },
})

const participants = ref([])
const loading = ref(false)

// Watch for activity ID changes
watch(
  () => props.activityId,
  async (newId) => {
    if (newId) {
      await loadParticipants()
    }
  },
  { immediate: true },
)

const loadParticipants = async () => {
  if (!props.activityId) return

  loading.value = true
  try {
    participants.value = await getActivityParticipants(props.activityId)
  } catch (error) {
    console.error('Error loading participants:', error)
    alert('Failed to load participants')
  } finally {
    loading.value = false
  }
}

// Expose method to parent component
defineExpose({
  loadParticipants,
})
</script>

<style scoped>
.modal-header {
  border-bottom: 2px solid #000;
}

.table {
  margin-bottom: 0;
}

.table-dark th {
  background-color: #000 !important;
  color: white !important;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: default;
}

.font-monospace {
  font-family: 'Courier New', monospace;
}
</style>
