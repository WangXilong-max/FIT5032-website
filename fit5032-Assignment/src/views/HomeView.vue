<template>
  <section id="hero" class="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
    <div class="hero-bg position-absolute w-100 h-100"></div>
    <div class="container text-center position-relative">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <h1 class="hero-title mb-4">SportSync</h1>
          <p class="lead fs-2 mb-3 hero-subtitle text-white">Connect Through Sports, Reach Your Health Goals</p>
          <p class="fs-5 mb-5 text-white" style="opacity: 0.9;">Discover, Book, Participate - Your One-Stop Sports Platform</p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <router-link to="/activities" class="btn btn-primary btn-lg px-5 py-3 rounded-pill">
              <i class="bi bi-calendar-event me-2"></i>Book Now
            </router-link>
            <button type="button" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill" @click="$emit('create-event')">
              <i class="bi bi-plus-circle me-2"></i>Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-indicator position-absolute bottom-0 start-50 translate-middle-x mb-4">
      <div class="scroll-arrow"></div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['create-event'])
</script>

<style scoped>
.hero-section {
  background: url('/hero-background.jpg') center/cover no-repeat !important;
  position: relative;
  min-height: 100vh !important;
}

.hero-bg {
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  color: #ffffff !important;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-subtitle {
  font-weight: 300;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.scroll-indicator {
  opacity: 0.7;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}
</style>
