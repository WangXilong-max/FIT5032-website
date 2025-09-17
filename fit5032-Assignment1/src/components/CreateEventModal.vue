<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.0);">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header text-white" style="background-color: #000000;">
          <h5 class="modal-title">
            <i class="bi bi-plus-circle me-2"></i>Create New Event
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="eventName" class="form-label fw-bold">Event Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="eventName" 
                  v-model="form.eventName"
                  :class="{ 'is-invalid': errors.eventName }"
                  placeholder="Enter event name"
                >
                <div v-if="errors.eventName" class="invalid-feedback">{{ errors.eventName }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="category" class="form-label fw-bold">Sport Category <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  id="category" 
                  v-model="form.category"
                  :class="{ 'is-invalid': errors.category }"
                >
                  <option value="">Select sport category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="eventDate" class="form-label fw-bold">Event Date <span class="text-danger">*</span></label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="eventDate" 
                  v-model="form.eventDate"
                  :class="{ 'is-invalid': errors.eventDate }"
                >
                <div v-if="errors.eventDate" class="invalid-feedback">{{ errors.eventDate }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="eventTime" class="form-label fw-bold">Event Time <span class="text-danger">*</span></label>
                <input 
                  type="time" 
                  class="form-control" 
                  id="eventTime" 
                  v-model="form.eventTime"
                  :class="{ 'is-invalid': errors.eventTime }"
                >
                <div v-if="errors.eventTime" class="invalid-feedback">{{ errors.eventTime }}</div>
              </div>

              <div class="col-12 mb-3">
                <label for="location" class="form-label fw-bold">Event Location <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="location" 
                  v-model="form.location"
                  :class="{ 'is-invalid': errors.location }"
                  placeholder="Enter detailed address"
                >
                <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="maxParticipants" class="form-label fw-bold">Max Participants <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="maxParticipants" 
                  v-model="form.maxParticipants"
                  :class="{ 'is-invalid': errors.maxParticipants }"
                  placeholder="Enter number of participants"
                  min="1"
                  max="1000"
                >
                <div v-if="errors.maxParticipants" class="invalid-feedback">{{ errors.maxParticipants }}</div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="ticketPrice" class="form-label fw-bold">Ticket Price ($) <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="ticketPrice" 
                  v-model="form.ticketPrice"
                  :class="{ 'is-invalid': errors.ticketPrice }"
                  placeholder="0.00"
                  min="0"
                  max="10000"
                  step="0.01"
                >
                <div v-if="errors.ticketPrice" class="invalid-feedback">{{ errors.ticketPrice }}</div>
                <div class="form-text">Enter 0 for free events</div>
              </div>

              <div class="col-12 mb-3">
                <label for="contactEmail" class="form-label fw-bold">Contact Email <span class="text-danger">*</span></label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="contactEmail" 
                  v-model="form.contactEmail"
                  :class="{ 'is-invalid': errors.contactEmail }"
                  placeholder="example@email.com"
                >
                <div v-if="errors.contactEmail" class="invalid-feedback">{{ errors.contactEmail }}</div>
              </div>

              <div class="col-12 mb-3">
                <label for="description" class="form-label fw-bold">Event Description <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control" 
                  id="description" 
                  rows="4" 
                  v-model="form.description"
                  :class="{ 'is-invalid': errors.description }"
                  placeholder="Please describe the event details, rules, and important notes"
                ></textarea>
                <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                <div class="form-text">{{ form.description.length }}/1000 characters</div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="resetForm">
            <i class="bi bi-arrow-clockwise me-2"></i>Reset Form
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            <i class="bi bi-check-circle me-2"></i>Create Event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { sanitizeInput, validateEmail, validateNumeric } from '../utils/security.js'

const props = defineProps({
  show: Boolean,
  categories: Array
})

const emit = defineEmits(['close', 'create'])

const form = ref({
  eventName: '',
  eventDate: '',
  eventTime: '',
  location: '',
  category: '',
  maxParticipants: '',
  ticketPrice: '',
  description: '',
  contactEmail: ''
})

const errors = ref({})

const validateForm = () => {
  const newErrors = {}
  
  const eventName = sanitizeInput(form.value.eventName)
  if (!eventName || eventName.length < 3 || eventName.length > 100) {
    newErrors.eventName = "Event name must be 3-100 characters"
  }
  
  if (!form.value.eventDate) {
    newErrors.eventDate = "Please select an event date"
  } else {
    const selectedDate = new Date(form.value.eventDate)
    const today = new Date()
    if (selectedDate < today) {
      newErrors.eventDate = "Event date cannot be in the past"
    }
  }
  
  if (!form.value.eventTime) {
    newErrors.eventTime = "Please select an event time"
  }
  
  const location = sanitizeInput(form.value.location)
  if (!location || location.length < 5 || location.length > 200) {
    newErrors.location = "Location must be 5-200 characters"
  }
  
  if (!form.value.category || !props.categories.includes(form.value.category)) {
    newErrors.category = "Please select a valid sport category"
  }
  
  if (!validateNumeric(form.value.maxParticipants, 1, 1000)) {
    newErrors.maxParticipants = "Participants must be between 1-1000"
  }
  
  if (!validateNumeric(form.value.ticketPrice, 0, 10000)) {
    newErrors.ticketPrice = "Price must be between $0-$10000"
  }
  
  const description = sanitizeInput(form.value.description)
  if (!description || description.length < 10 || description.length > 1000) {
    newErrors.description = "Description must be 10-1000 characters"
  }
  
  if (!validateEmail(form.value.contactEmail)) {
    newErrors.contactEmail = "Please enter a valid email address"
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    const eventData = {
      name: sanitizeInput(form.value.eventName),
      category: form.value.category,
      date: form.value.eventDate,
      time: form.value.eventTime,
      location: sanitizeInput(form.value.location),
      maxParticipants: parseInt(form.value.maxParticipants),
      price: parseFloat(form.value.ticketPrice),
      description: sanitizeInput(form.value.description),
      contactEmail: form.value.contactEmail.toLowerCase().trim()
    }
    emit('create', eventData)
    resetForm()
  } else {
    alert('Please correct the errors in the form')
  }
}

const resetForm = () => {
  form.value = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: '',
    maxParticipants: '',
    ticketPrice: '',
    description: '',
    contactEmail: ''
  }
  errors.value = {}
}

watch(() => props.show, (newVal) => {
  if (!newVal) resetForm()
})
</script>

<style scoped>
.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545 !important;
  display: block !important;
}
</style>
