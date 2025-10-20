<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0)"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header text-white" style="background-color: #000000">
          <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Create New Event</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
            aria-label="Close modal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="eventName" class="form-label fw-bold"
                  >Event Name <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  id="eventName"
                  v-model="form.eventName"
                  @blur="
                    touched.eventName = true
                    validateField('eventName')
                  "
                  :class="{ 'is-invalid': touched.eventName && errors.eventName }"
                  placeholder="Enter event name"
                />
                <div
                  v-if="touched.eventName && errors.eventName"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.eventName }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="category" class="form-label fw-bold"
                  >Sport Category <span class="text-danger">*</span></label
                >
                <select
                  class="form-select"
                  id="category"
                  v-model="form.category"
                  @blur="
                    touched.category = true
                    validateField('category')
                  "
                  :class="{ 'is-invalid': touched.category && errors.category }"
                >
                  <option value="">Select sport category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <div
                  v-if="touched.category && errors.category"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.category }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="eventDate" class="form-label fw-bold"
                  >Event Date <span class="text-danger">*</span></label
                >
                <input
                  type="date"
                  class="form-control"
                  id="eventDate"
                  v-model="form.eventDate"
                  @blur="
                    touched.eventDate = true
                    validateField('eventDate')
                  "
                  :class="{ 'is-invalid': touched.eventDate && errors.eventDate }"
                />
                <div
                  v-if="touched.eventDate && errors.eventDate"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.eventDate }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="eventTime" class="form-label fw-bold"
                  >Event Time <span class="text-danger">*</span></label
                >
                <input
                  type="time"
                  class="form-control"
                  id="eventTime"
                  v-model="form.eventTime"
                  @blur="
                    touched.eventTime = true
                    validateField('eventTime')
                  "
                  :class="{ 'is-invalid': touched.eventTime && errors.eventTime }"
                />
                <div
                  v-if="touched.eventTime && errors.eventTime"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.eventTime }}
                </div>
              </div>

              <div class="col-12 mb-3">
                <label for="location" class="form-label fw-bold"
                  >Event Location <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  v-model="form.location"
                  @blur="
                    touched.location = true
                    validateField('location')
                  "
                  :class="{ 'is-invalid': touched.location && errors.location }"
                  placeholder="Enter detailed address"
                />
                <div
                  v-if="touched.location && errors.location"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.location }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="maxParticipants" class="form-label fw-bold"
                  >Max Participants <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  id="maxParticipants"
                  v-model="form.maxParticipants"
                  @blur="
                    touched.maxParticipants = true
                    validateField('maxParticipants')
                  "
                  :class="{ 'is-invalid': touched.maxParticipants && errors.maxParticipants }"
                  placeholder="Enter number of participants"
                  min="1"
                  max="1000"
                />
                <div
                  v-if="touched.maxParticipants && errors.maxParticipants"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.maxParticipants }}
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="ticketPrice" class="form-label fw-bold"
                  >Ticket Price ($) <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  id="ticketPrice"
                  v-model="form.ticketPrice"
                  @blur="
                    touched.ticketPrice = true
                    validateField('ticketPrice')
                  "
                  :class="{ 'is-invalid': touched.ticketPrice && errors.ticketPrice }"
                  placeholder="0.00"
                  min="0"
                  max="10000"
                  step="0.01"
                />
                <div
                  v-if="touched.ticketPrice && errors.ticketPrice"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.ticketPrice }}
                </div>
                <div class="form-text">Enter 0 for free events</div>
              </div>

              <div class="col-12 mb-3">
                <label for="contactEmail" class="form-label fw-bold"
                  >Contact Email <span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  class="form-control"
                  id="contactEmail"
                  v-model="form.contactEmail"
                  @blur="
                    touched.contactEmail = true
                    validateField('contactEmail')
                  "
                  :class="{ 'is-invalid': touched.contactEmail && errors.contactEmail }"
                  placeholder="example@email.com"
                />
                <div
                  v-if="touched.contactEmail && errors.contactEmail"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.contactEmail }}
                </div>
              </div>

              <div class="col-12 mb-3">
                <label for="description" class="form-label fw-bold"
                  >Event Description <span class="text-danger">*</span></label
                >
                <textarea
                  class="form-control"
                  id="description"
                  rows="4"
                  v-model="form.description"
                  @blur="
                    touched.description = true
                    validateField('description')
                  "
                  :class="{ 'is-invalid': touched.description && errors.description }"
                  placeholder="Please describe the event details, rules, and important notes"
                ></textarea>
                <div
                  v-if="touched.description && errors.description"
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.description }}
                </div>
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
  categories: Array,
})

const emit = defineEmits(['close', 'create'])

const formFields = [
  'eventName',
  'eventDate',
  'eventTime',
  'location',
  'category',
  'maxParticipants',
  'ticketPrice',
  'description',
  'contactEmail',
]

const form = ref({
  eventName: '',
  eventDate: '',
  eventTime: '',
  location: '',
  category: '',
  maxParticipants: '',
  ticketPrice: '',
  description: '',
  contactEmail: '',
})

const errors = ref({})
const touched = ref(Object.fromEntries(formFields.map((field) => [field, false])))

const validators = {
  eventName: () => {
    const value = sanitizeInput(form.value.eventName)
    return !value || value.length < 3 || value.length > 100
      ? 'Event name must be 3-100 characters'
      : ''
  },
  eventDate: () => {
    if (!form.value.eventDate) return 'Please select an event date'
    const selectedDate = new Date(form.value.eventDate)
    const today = new Date()
    if (selectedDate < today) return 'Event date cannot be in the past'
    return ''
  },
  eventTime: () => {
    return !form.value.eventTime ? 'Please select an event time' : ''
  },
  location: () => {
    const value = sanitizeInput(form.value.location)
    return !value || value.length < 5 || value.length > 200
      ? 'Location must be 5-200 characters'
      : ''
  },
  category: () => {
    return !form.value.category || !props.categories.includes(form.value.category)
      ? 'Please select a valid sport category'
      : ''
  },
  maxParticipants: () => {
    return !validateNumeric(form.value.maxParticipants, 1, 1000)
      ? 'Participants must be between 1-1000'
      : ''
  },
  ticketPrice: () => {
    return !validateNumeric(form.value.ticketPrice, 0, 10000)
      ? 'Price must be between $0-$10000'
      : ''
  },
  description: () => {
    const value = sanitizeInput(form.value.description)
    return !value || value.length < 10 || value.length > 1000
      ? 'Description must be 10-1000 characters'
      : ''
  },
  contactEmail: () => {
    return !validateEmail(form.value.contactEmail) ? 'Please enter a valid email address' : ''
  },
}

const validateField = (field) => {
  errors.value[field] = validators[field]()
}

const validateForm = () => {
  const newErrors = {}
  Object.keys(validators).forEach((key) => {
    newErrors[key] = validators[key]()
  })
  errors.value = newErrors
  return Object.values(newErrors).every((msg) => !msg)
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
      contactEmail: form.value.contactEmail.toLowerCase().trim(),
    }
    emit('create', eventData)
    resetForm()
  } else {
    touched.value = Object.fromEntries(formFields.map((field) => [field, true]))
  }
}

const resetForm = () => {
  form.value = Object.fromEntries(formFields.map((field) => [field, '']))
  errors.value = {}
  touched.value = Object.fromEntries(formFields.map((field) => [field, false]))
}

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) resetForm()
  },
)
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
