<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">
        <span class="brand-text">SportSync</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#hero">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#news">Sports News</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#activities">Book Activities</a>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <a class="nav-link" href="#admin">Admin Panel</a>
          </li>
          <li class="nav-item" v-if="currentUser">
            <span class="nav-link">Hello, {{ currentUser.username }} ({{ currentUser.role }})</span>
          </li>
          <li class="nav-item" v-if="currentUser">
            <button class="btn btn-outline-light btn-sm" @click="$emit('logout')">Logout</button>
          </li>
          <li class="nav-item" v-if="!currentUser">
            <button class="btn btn-outline-light btn-sm" @click="$emit('show-auth')">Login</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  currentUser: Object,
  isAdmin: Boolean,
  isScrolled: Boolean
})

defineEmits(['logout', 'show-auth'])
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
</style>
