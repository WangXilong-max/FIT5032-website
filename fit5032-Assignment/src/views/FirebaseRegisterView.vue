<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter password (at least 6 characters)"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Confirm your password"
            minlength="6"
          />
        </div>

        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        Registration successful! Redirecting to homepage...
      </div>

      <div class="signin-link">
        Already have an account?
        <router-link to="/signin">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/firebase/auth'

export default {
  name: 'FirebaseRegisterView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const handleRegister = async () => {
      // Validate password match
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }

      loading.value = true
      error.value = ''
      success.value = false

      const result = await registerUser(email.value, password.value)

      if (result.success) {
        success.value = true
        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        error.value = getErrorMessage(result.error)
      }

      loading.value = false
    }

    const getErrorMessage = (errorMessage) => {
      if (errorMessage.includes('email-already-in-use')) {
        return 'This email is already registered'
      } else if (errorMessage.includes('weak-password')) {
        return 'Password is too weak, please enter at least 6 characters'
      } else if (errorMessage.includes('invalid-email')) {
        return 'Invalid email format'
      } else if (errorMessage.includes('auth/operation-not-allowed')) {
        return 'Email/Password authentication is not enabled'
      } else {
        return `Registration failed: ${errorMessage}`
      }
    }

    return {
      email,
      password,
      confirmPassword,
      loading,
      error,
      success,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
}

.register-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-btn:hover:not(:disabled) {
  background-color: #333;
}

.register-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.success-message {
  color: #155724;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

.signin-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.signin-link a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

.signin-link a:hover {
  text-decoration: underline;
}
</style>
