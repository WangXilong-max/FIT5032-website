<template>
  <div class="signin-container">
    <div class="signin-card">
      <h2>Sign In</h2>
      <form @submit.prevent="handleSignIn">
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
            placeholder="Enter your password"
            minlength="6"
          />
        </div>

        <button type="submit" :disabled="loading" class="signin-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="signup-link">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/firebase/auth'

export default {
  name: 'FirebaseSignInView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const handleSignIn = async () => {
      loading.value = true
      error.value = ''

      const result = await loginUser(email.value, password.value)

      if (result.success) {
        console.log('Sign in successful:', result.user)
        router.push('/')
      } else {
        error.value = getErrorMessage(result.error)
      }

      loading.value = false
    }

    const getErrorMessage = (errorMessage) => {
      if (errorMessage.includes('user-not-found')) {
        return 'User not found'
      } else if (errorMessage.includes('wrong-password')) {
        return 'Incorrect password'
      } else if (errorMessage.includes('invalid-email')) {
        return 'Invalid email format'
      } else if (errorMessage.includes('too-many-requests')) {
        return 'Too many requests, please try again later'
      } else {
        return 'Sign in failed, please check your email and password'
      }
    }

    return {
      email,
      password,
      loading,
      error,
      handleSignIn
    }
  }
}
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.signin-card {
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
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.signin-btn {
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

.signin-btn:hover:not(:disabled) {
  background-color: #333;
}

.signin-btn:disabled {
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

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.signup-link a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
