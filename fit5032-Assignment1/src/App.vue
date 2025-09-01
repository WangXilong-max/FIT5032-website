<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sportsNews = ref([
  {
    id: 1,
    title: 'Weekend Badminton Tournament - Registration Open',
    summary: 'Join our amateur badminton tournament at the city sports center. Players of all levels welcome!',
    date: '2024-01-15',
    image: '/badminton.jpeg',
    category: 'Badminton'
  },
  {
    id: 2,
    title: '3v3 Street Basketball Challenge Recruitment',
    summary: 'Show off your street ball skills and compete against the city\'s strongest teams',
    date: '2024-01-14',
    image: '/basketball.jpeg',
    category: 'Basketball'
  },
  {
    id: 3,
    title: 'Swimming Club Adds Evening Sessions',
    summary: 'New 8-10 PM time slots exclusively for working professionals with professional coaching',
    date: '2024-01-13',
    image: '/swimming.jpeg',
    category: 'Swimming'
  },
  {
    id: 4,
    title: 'Youth Football Academy Spring Enrollment',
    summary: 'Professional youth coaching team to develop the next generation of football stars',
    date: '2024-01-12',
    image: '/football.jpeg',
    category: 'Football'
  },
  {
    id: 5,
    title: 'Tennis Club Membership Recruitment',
    summary: 'Professional indoor tennis courts with latest facilities and expert coaching',
    date: '2024-01-11',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=250&fit=crop',
    category: 'Tennis'
  },
  {
    id: 6,
    title: 'Table Tennis Open Championship - Registration Deadline',
    summary: 'Only 3 days left to register! Don\'t miss your chance to showcase your skills',
    date: '2024-01-10',
    image: '/table tennis.jpeg',
    category: 'Table Tennis'
  }
])


const isScrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
  
  // 组件卸载时清理事件监听器
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<template>
  <div id="app">

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
            <li class="nav-item">
              <a class="nav-link" href="#about">About Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>


    <section id="hero" class="hero-section min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <div class="hero-bg position-absolute w-100 h-100"></div>
      <div class="container text-center position-relative">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <h1 class="display-1 fw-bold mb-4 hero-title text-white">
              <span class="gradient-text">SportSync</span>
            </h1>
            <p class="lead fs-2 mb-3 hero-subtitle text-white">Connect Through Sports, Reach Your Health Goals</p>
            <p class="fs-5 mb-5 text-white" style="opacity: 0.9;">Discover, Book, Participate - Your One-Stop Sports Platform</p>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button type="button" class="btn btn-primary btn-lg px-5 py-3 rounded-pill">
                <i class="bi bi-calendar-event me-2"></i>Book Now
              </button>
              <button type="button" class="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
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

    <section id="news" class="py-5 news-section text-white">
      <div class="container py-5">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-4 fw-bold mb-3">Sports News</h2>
            <p class="lead text-light opacity-75">Stay updated with the latest local sports activities and events</p>
          </div>
        </div>
        
        <div class="news-grid">
          <div 
            v-for="news in sportsNews" 
            :key="news.id" 
            class="news-item"
          >
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

    <footer class="bg-dark text-white py-5">
      <div class="container">
        <div class="footer-content">
          <div class="footer-item">
            <h5 class="fw-bold mb-3">SportSync</h5>
            <p class="text-muted">Making sports a part of life, connecting every sports enthusiast</p>
          </div>
          
          <div class="footer-item">
            <h6 class="fw-bold mb-3">Quick Links</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Book Activities</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Create Event</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Sports Venues</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">My Profile</a></li>
            </ul>
          </div>
          
          <div class="footer-item">
            <h6 class="fw-bold mb-3">Support</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Help Center</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Contact Support</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Feedback</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">FAQ</a></li>
            </ul>
          </div>
          
          <div class="footer-item">
            <h6 class="fw-bold mb-3">Legal</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Privacy Policy</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Terms of Service</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">User Agreement</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Disclaimer</a></li>
            </ul>
          </div>
          
          <div class="footer-item">
            <h6 class="fw-bold mb-3">Contact Us</h6>
            <ul class="list-unstyled">
              <li class="mb-2 text-muted">
                <i class="bi bi-envelope me-2"></i>contact@sportsync.com
              </li>
              <li class="mb-2 text-muted">
                <i class="bi bi-telephone me-2"></i>+1 (555) 123-4567
              </li>
              <li class="mb-2 text-muted">
                <i class="bi bi-geo-alt me-2"></i>123 Sports Center, New York, NY 10001
              </li>
            </ul>
          </div>
        </div>
        
        <hr class="my-4 border-secondary">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="text-muted mb-0">&copy; 2024 SportSync. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">Built with Bootstrap & Vue.js</small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.navbar {
  background: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(0, 0, 0, 0.9) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.brand-text {
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
}

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
}

.gradient-text {
  color: white !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  font-weight: 800;
}

.hero-subtitle {
  font-weight: 300;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.btn-primary {
  background: #000000 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  background: #1a1a1a !important;
  color: white !important;
  border: none !important;
}

.btn-primary:focus,
.btn-primary:active,
.btn-primary:focus-visible {
  background: #000000 !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  outline: none !important;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
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
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(45deg); }
  40% { transform: translateY(-10px) rotate(45deg); }
  60% { transform: translateY(-5px) rotate(45deg); }
}

.news-card {
  transition: all 0.3s ease;
  border-radius: 20px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid #dee2e6;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
}

.news-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(255, 255, 255, 0.2) !important;
}

.news-image {
  transition: transform 0.3s ease;
  width: 100% !important;
  height: 250px !important;
  object-fit: cover !important;
  object-position: center !important;
}

.news-card:hover .news-image {
  transform: scale(1.1);
}

/* 统一内容区域高度 */
.news-content {
  height: 180px !important;
  padding: 1.5rem !important;
  overflow: hidden;
}

/* 基础新闻网格布局 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
}

.news-item {
  width: 100%;
}

/* 新闻区域纯黑色背景 */
.news-section {
  background: #000000 !important;
}

/* 基础底栏布局 - 固定一行五列 */
.footer-content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  width: 100%;
}

.footer-item {
  width: 100%;
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: clamp(2rem, 8vw, 2.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(0.9rem, 4vw, 1.1rem) !important;
  }
  
  .display-4 {
    font-size: clamp(1.5rem, 6vw, 2rem) !important;
  }

  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem;
  }
  
  .news-content {
    height: 140px !important;
    padding: 1rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 180px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 0.5rem;
  }
  
  .news-card {
    font-size: 0.8rem;
  }
  
  .news-card .card-title {
    font-size: 0.9rem !important;
  }
  
  .news-card .card-text {
    font-size: 0.75rem !important;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .container {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  .footer-item h5,
  .footer-item h6 {
    font-size: 0.9rem !important;
  }
  
  .footer-item p,
  .footer-item ul li {
    font-size: 0.75rem !important;
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .hero-title {
    font-size: clamp(2.5rem, 6vw, 3rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.2rem) !important;
  }
  
  .display-4 {
    font-size: clamp(1.8rem, 5vw, 2.2rem) !important;
  }
  
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem;
  }
  
  .news-content {
    height: 160px !important;
    padding: 1.2rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 200px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .hero-title {
    font-size: clamp(3rem, 5vw, 3.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.3rem) !important;
  }
  
  .display-4 {
    font-size: clamp(2rem, 4vw, 2.4rem) !important;
  }
  
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem;
  }
  
  .news-content {
    height: 170px !important;
    padding: 1.3rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 220px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1.5rem;
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .hero-title {
    font-size: clamp(3.5rem, 4vw, 4rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1.2rem, 2vw, 1.4rem) !important;
  }
  
  .display-4 {
    font-size: clamp(2.2rem, 3vw, 2.6rem) !important;
  }
  
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.8rem;
  }
  
  .news-content {
    height: 175px !important;
    padding: 1.4rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 240px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1.8rem;
  }
}

@media (min-width: 1200px) and (max-width: 1399.98px) {
  .hero-title {
    font-size: clamp(4rem, 3.5vw, 4.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1.3rem, 1.8vw, 1.5rem) !important;
  }
  
  .display-4 {
    font-size: clamp(2.4rem, 2.5vw, 2.8rem) !important;
  }
  
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2rem;
  }
  
  .news-content {
    height: 180px !important;
    padding: 1.5rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 250px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 2rem;
  }
}


@media (min-width: 1400px) {
  .hero-title {
    font-size: clamp(4.5rem, 3vw, 5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1.4rem, 1.5vw, 1.6rem) !important;
  }
  
  .display-4 {
    font-size: clamp(2.6rem, 2vw, 3rem) !important;
  }
  
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2.5rem;
  }
  
  .news-content {
    height: 190px !important;
    padding: 1.6rem !important;
    overflow: hidden;
  }
  
  .news-image {
    height: 270px !important;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 2.5rem;
  }
}

html {
  scroll-behavior: smooth;
}

</style>