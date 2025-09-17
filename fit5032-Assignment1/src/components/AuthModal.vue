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
              <input type="text" class="form-control" v-model="form.username" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" v-model="form.password" required>
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
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  authMode: String
})

const emit = defineEmits(['close', 'login', 'register', 'toggle-mode'])

const form = ref({ username: '', password: '', role: 'user' })

const handleSubmit = () => {
  if (props.authMode === 'login') {
    emit('login', form.value)
  } else {
    emit('register', form.value)
  }
}

const toggleMode = () => {
  emit('toggle-mode')
  form.value = { username: '', password: '', role: 'user' }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    form.value = { username: '', password: '', role: 'user' }
  }
})
</script>
