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
              <input type="text" class="form-control" :class="{ 'is-invalid': touched.username && mergedErrors.username }" v-model="form.username" @blur="touched.username = true; validateUsername()" required>
              <div v-if="touched.username && mergedErrors.username" class="invalid-feedback d-block">{{ mergedErrors.username }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" :class="{ 'is-invalid': authMode === 'register' && touched.password && mergedErrors.password }" v-model="form.password" @blur="touched.password = true; validatePassword()" required>
              <div v-if="authMode === 'register' && touched.password && mergedErrors.password" class="invalid-feedback d-block">{{ mergedErrors.password }}</div>
              <div v-if="authMode === 'register'" class="form-text">
                Must be 8+ chars and include uppercase, number, special char
              </div>
            </div>
            <div class="mb-3" v-if="authMode === 'register'">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" :class="{ 'is-invalid': touched.email && mergedErrors.email }" v-model="form.email" @blur="touched.email = true; validateEmailField()" required>
              <div v-if="touched.email && mergedErrors.email" class="invalid-feedback d-block">{{ mergedErrors.email }}</div>
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
  if (!validateAll()) {
    touched.value = { username: true, password: true, email: true }
    return
  }
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

watch(() => props.externalErrors, (val) => {
  if (!val) return
  Object.keys(val).forEach((key) => {
    if (val[key]) {
      touched.value[key] = true
    }
  })
}, { deep: true })
</script>
