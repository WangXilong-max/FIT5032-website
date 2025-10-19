<template>
  <div class="modal fade" id="participantsModal" tabindex="-1" aria-labelledby="participantsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="participantsModalLabel">
            <i class="bi bi-people-fill me-2"></i>Participants List
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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
            <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
            <p class="text-muted mt-3">No participants yet</p>
          </div>

          <!-- Participants List -->
          <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="mb-0">
                <strong>{{ participants.length }}</strong> participant{{ participants.length > 1 ? 's' : '' }} registered
              </p>
              <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-success" @click="exportCSV" title="Export as CSV">
                  <i class="bi bi-file-earmark-spreadsheet me-1"></i>CSV
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="exportPDF" title="Export as PDF">
                  <i class="bi bi-file-earmark-pdf me-1"></i>PDF
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-dark">
                  <tr>
                    <th style="width: 50px;">#</th>
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
                      <small class="text-muted font-monospace">{{ participant.userId.substring(0, 8) }}...</small>
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
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps({
  activityId: {
    type: String,
    default: null
  },
  activityName: {
    type: String,
    default: 'Activity'
  }
})

const participants = ref([])
const loading = ref(false)

// Watch for activity ID changes
watch(() => props.activityId, async (newId) => {
  if (newId) {
    await loadParticipants()
  }
}, { immediate: true })

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

// Export to CSV
const exportCSV = () => {
  if (participants.value.length === 0) {
    alert('No participants to export')
    return
  }

  // Create CSV content
  const headers = ['No', 'Name', 'Email', 'User ID']
  const rows = participants.value.map((p, index) => [
    index + 1,
    p.displayName,
    p.email,
    p.userId
  ])

  let csvContent = headers.join(',') + '\n'
  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
  })

  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(props.activityName)}_participants.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Export to PDF
const exportPDF = () => {
  console.log('exportPDF called')
  console.log('participants:', participants.value)

  if (participants.value.length === 0) {
    alert('No participants to export')
    return
  }

  try {
    console.log('Creating PDF...')
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text('Participants List', 14, 20)

    // Activity name
    doc.setFontSize(12)
    doc.text('Activity: ' + props.activityName, 14, 30)

    // Date
    doc.setFontSize(10)
    doc.text('Generated: ' + new Date().toLocaleString(), 14, 38)

    // Participants count
    doc.text('Total Participants: ' + participants.value.length, 14, 45)

    // Table
    const tableData = participants.value.map((p, index) => [
      index + 1,
      p.displayName || 'N/A',
      p.email || 'N/A',
      (p.userId || '').substring(0, 12) + '...'
    ])

    console.log('Table data:', tableData)

    // Use autoTable - call it directly from imported module
    autoTable(doc, {
      startY: 52,
      head: [['No', 'Name', 'Email', 'User ID']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255]
      },
      styles: {
        fontSize: 9
      }
    })

    // Save PDF
    const filename = sanitizeFilename(props.activityName) + '_participants.pdf'
    console.log('Saving PDF as:', filename)
    doc.save(filename)
    console.log('PDF saved successfully')
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF: ' + error.message)
  }
}

// Sanitize filename
const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

// Expose method to parent component
defineExpose({
  loadParticipants
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

.btn-group .btn {
  border-color: #dee2e6;
}

.btn-outline-success:hover {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
</style>
