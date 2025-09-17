<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ authMode === 'login' ? 'Login' : 'Register' }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" v-model="form.username" @blur="touched.username = true; validateUsername()" required>
              <div v-if="touched.username && mergedErrors.username" class="text-danger small mt-1">{{ mergedErrors.username }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" v-model="form.password" @blur="touched.password = true; validatePassword()" required>
              <div v-if="authMode === 'register' && touched.password && mergedErrors.password" class="text-danger small mt-1">{{ mergedErrors.password }}</div>
              <div v-if="authMode === 'register'" class="form-text">
                Must be 8+ chars and include uppercase, number, special char
              </div>
            </div>
            <div class="mb-3" v-if="authMode === 'register'">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="form.email" @blur="touched.email = true; validateEmailField()" required>
              <div v-if="touched.email && mergedErrors.email" class="text-danger small mt-1">{{ mergedErrors.email }}</div>
            </div>
            <div class="mb-3" v-if="authMode === 'register'">
              <label class="form-label">Role</label>
              <select class="form-select" v-model="form.role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              {{ authMode === 'login' ? 'Login' : 'Register' }}
            </button>
          </form>
          <div class="text-center mt-3">
            <button class="btn btn-link" @click="toggleMode">
              {{ authMode === 'login' ? 'Need an account? Register' : 'Have an account? Login' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { validateEmail } from '../utils/security.js'

const props = defineProps({
  show: Boolean,
  authMode: String,
  externalErrors: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'login', 'register', 'toggle-mode'])

const form = ref({ username: '', password: '', role: 'user', email: '' })
const touched = ref({ username: false, password: false, email: false })
const errors = ref({ username: '', password: '', email: '' })

const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const validateUsername = () => {
  errors.value.username = form.value.username && form.value.username.length >= 3 ? '' : 'Username must be at least 3 characters'
}

const validatePassword = () => {
  if (props.authMode === 'login') { errors.value.password = ''; return }
  errors.value.password = strongPassword.test(form.value.password) ? '' : 'Password must be 8+ chars with uppercase, number and special char'
}

const validateEmailField = () => {
  if (props.authMode === 'login') { errors.value.email = ''; return }
  errors.value.email = validateEmail(form.value.email) ? '' : 'Please enter a valid email'
}

const validateAll = () => {
  validateUsername()
  validatePassword()
  validateEmailField()
  return !errors.value.username && !errors.value.password && !errors.value.email
}

const mergedErrors = computed(() => ({ ...errors.value, ...props.externalErrors }))

const handleSubmit = () => {
  if (!validateAll()) return
  if (props.authMode === 'login') {
    emit('login', form.value)
  } else {
    emit('register', form.value)
  }
}

const toggleMode = () => {
  emit('toggle-mode')
  form.value = { username: '', password: '', role: 'user', email: '' }
  touched.value = { username: false, password: false, email: false }
  errors.value = { username: '', password: '', email: '' }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    form.value = { username: '', password: '', role: 'user', email: '' }
    touched.value = { username: false, password: false, email: false }
    errors.value = { username: '', password: '', email: '' }
  }
})
</script>
