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
  background: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(10px);
}

.navbar-scrolled {
  background: rgba(0, 0, 0, 0.9) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
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
</style>
