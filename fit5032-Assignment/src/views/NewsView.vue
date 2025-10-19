<template>
  <section id="news" class="py-5 news-section text-white">
    <div class="container py-5">
      <div class="row text-center mb-5">
        <div class="col-lg-8 mx-auto">
          <h2 class="display-4 fw-bold mb-3">Sports News</h2>
          <p class="lead text-light opacity-75">Stay updated with the latest local sports activities and events</p>
        </div>
      </div>
      <div class="row g-4">
        <div v-for="news in sportsNews" :key="news.id" class="col-12 col-md-6 col-lg-4">
          <div class="card news-card">
            <div class="position-relative overflow-hidden">
              <img :src="news.image" :alt="news.title" class="card-img-top news-image">
              <div class="position-absolute top-0 start-0 m-3">
                <span class="badge bg-primary rounded-pill">{{ news.category }}</span>
              </div>
            </div>
            <div class="card-body d-flex flex-column news-content">
              <div class="d-flex align-items-center mb-2">
                <small class="text-primary fw-semibold">{{ news.date }}</small>
              </div>
              <h5 class="card-title fw-bold">{{ news.title }}</h5>
              <p class="card-text text-muted">{{ news.summary }}</p>
              <button class="btn btn-outline-primary mt-auto align-self-start">
                Read More <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { sportsNews } from '../data/sportsData.js'
</script>

<style scoped>
.news-section {
  background: #000000 !important;
  min-height: 100vh;
}

.news-card {
  border-radius: 20px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid #dee2e6;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
}

.news-image {
  width: 100% !important;
  height: 250px !important;
  object-fit: cover !important;
  object-position: center !important;
}

.news-content {
  height: 180px !important;
  padding: 1.5rem !important;
  overflow: hidden;
}

@media (max-width: 768px) {
  .news-content {
    height: 140px;
    padding: 1rem;
  }

  .display-4 {
    font-size: 2rem;
  }
}
</style>
