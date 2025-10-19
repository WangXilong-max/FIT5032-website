<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">
        <span class="brand-text">SportSync</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/news" class="nav-link" active-class="active">Sports News</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/activities" class="nav-link" active-class="active">Book Activities</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/my-activities" class="nav-link" active-class="active">My Activities</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
          </li>

          <!-- Show Login/Register when NOT logged in -->
          <template v-if="!currentUser">
            <li class="nav-item">
              <router-link to="/signin" class="nav-link" active-class="active">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link btn btn-outline-light ms-2" active-class="active">Register</router-link>
            </li>
          </template>

          <!-- Show User Info and Logout when logged in -->
          <template v-else>
            <li class="nav-item">
              <span class="nav-link text-light">
                <i class="bi bi-person-circle me-1"></i>
                {{ currentUser.email || currentUser.displayName }}
              </span>
            </li>
            <li class="nav-item">
              <button @click="handleLogout" class="nav-link btn btn-outline-light ms-2">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChange, logoutUser } from '@/firebase/auth'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/utils/storage'

const router = useRouter()

defineProps({
  isScrolled: Boolean
})

const currentUser = ref(null)

// Logout handler
const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    // Logout from Firebase
    const result = await logoutUser()

    // Clear local storage
    saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, null)

    // Clear current user
    currentUser.value = null

    // Redirect to home page
    router.push('/')

    if (result.success) {
      console.log('Logged out successfully')
    } else {
      console.error('Logout error:', result.error)
    }
  }
}

// Set up authentication listener
onMounted(() => {
  const unsubscribe = onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      // User is signed in with Firebase
      currentUser.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email
      }
      console.log('NavigationBar - User logged in:', firebaseUser.email)
    } else {
      // Check local storage as fallback
      const localUser = loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null)
      if (localUser) {
        currentUser.value = localUser
        console.log('NavigationBar - Local user detected:', localUser.email)
      } else {
        currentUser.value = null
        console.log('NavigationBar - No user logged in')
      }
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
.navbar {
  background: rgba(0, 0, 0, 1) !important;
  backdrop-filter: blur(10px);
}

.navbar-scrolled {
  background: rgba(0, 0, 0, 1) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.brand-text {
  color: #fff !important;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-link.active {
  color: #fff !important;
  font-weight: 600;
  border-bottom: 2px solid #fff;
}

.navbar-brand {
  text-decoration: none;
}

/* Register button styles */
.btn-outline-light {
  border: 1px solid #fff;
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #000;
  text-decoration: none;
}

/* User email display */
.nav-link.text-light {
  cursor: default;
  pointer-events: none;
}
</style>
