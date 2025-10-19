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
            <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signin" class="nav-link" active-class="active">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link btn btn-outline-light ms-2" active-class="active">Register</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  isScrolled: Boolean
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
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #000;
  text-decoration: none;
}
</style>
