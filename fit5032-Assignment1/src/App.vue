<script setup>
import { ref, onMounted } from 'vue'

const sportsNews = ref([
  {
    id: 1,
    title: 'Weekend Badminton Tournament - Registration Open',
    summary: 'Join our amateur badminton tournament at the city sports center. Players of all levels welcome!',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=250&fit=crop',
    category: 'Badminton'
  },
  {
    id: 2,
    title: '3v3 Street Basketball Challenge Recruitment',
    summary: 'Show off your street ball skills and compete against the city\'s strongest teams',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
    category: 'Basketball'
  },
  {
    id: 3,
    title: 'Swimming Club Adds Evening Sessions',
    summary: 'New 8-10 PM time slots exclusively for working professionals with professional coaching',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=250&fit=crop',
    category: 'Swimming'
  },
  {
    id: 4,
    title: 'Youth Football Academy Spring Enrollment',
    summary: 'Professional youth coaching team to develop the next generation of football stars',
    date: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=250&fit=crop',
    category: 'Table Tennis'
  }
])


const isScrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
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


    <section id="news" class="py-5 bg-light">
      <div class="container py-5">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-4 fw-bold mb-3">Sports News</h2>
            <p class="lead text-muted">Stay updated with the latest local sports activities and events</p>
          </div>
        </div>
        
        <div class="news-grid">
          <div 
            v-for="news in sportsNews" 
            :key="news.id" 
            class="news-item"
          >
            <div class="card h-100 shadow-sm news-card border-0">
              <div class="position-relative overflow-hidden">
                <img :src="news.image" :alt="news.title" class="card-img-top news-image" style="height: 250px; object-fit: cover;">
                <div class="position-absolute top-0 start-0 m-3">
                  <span class="badge bg-primary rounded-pill">{{ news.category }}</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center mb-2">
                  <small class="text-primary fw-semibold">{{ news.date }}</small>
                </div>
                <h5 class="card-title fw-bold">{{ news.title }}</h5>
                <p class="card-text text-muted flex-grow-1">{{ news.summary }}</p>
                <button class="btn btn-outline-primary mt-auto align-self-start">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section class="py-5 bg-primary text-white">
      <div class="container py-5">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-4 fw-bold mb-3">Why Choose SportSync</h2>
            <p class="lead opacity-75">Empowering Melbourne communities through accessible, inclusive sport for everyone</p>
          </div>
        </div>
        
        <div class="features-grid">
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-globe-asia-australia fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Community Reach</h4>
            <p class="opacity-75">Discover local sporting events and health activities across Melbourne, connecting you with your community</p>
          </div>
          
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-heart fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Health & Wellbeing</h4>
            <p class="opacity-75">Improve both physical and mental health through regular activity, with resources for all fitness levels</p>
          </div>
          
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-universal-access fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Inclusive Access</h4>
            <p class="opacity-75">Activities for all ages, backgrounds, and abilities - from beginners to advanced participants</p>
          </div>
          
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-calendar-event fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Easy Registration</h4>
            <p class="opacity-75">One-click event registration with automated reminders and streamlined participant management</p>
          </div>
          
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-people fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Volunteer Hub</h4>
            <p class="opacity-75">Join our community of volunteers and organisers to help run events and strengthen local connections</p>
          </div>
          
          <div class="feature-item text-center">
            <div class="feature-icon bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="bi bi-book fs-1"></i>
            </div>
            <h4 class="fw-bold mb-3">Health Education</h4>
            <p class="opacity-75">Access sport-specific health tips, injury prevention advice, and nutrition guidance to support your journey</p>
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
  background: url('/hero-background.jpeg') center/cover no-repeat !important;
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

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
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
}

.news-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.news-image {
  transition: transform 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.1);
}

.feature-icon {
  font-size: 2.5rem;
  transition: all 0.3s ease;
}

.feature-icon:hover {
  transform: scale(1.1);
}

/* 基础新闻网格布局 - 固定两行三列 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
}

.news-item {
  width: 100%;
}

/* 基础特色功能网格布局 - 固定两行三列 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
}

.feature-item {
  width: 100%;
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

/* 一致性响应式设计 - 保持相同布局结构 */

/* 所有设备都保持相同的网格结构，只调整尺寸和间距 */

/* 超小屏幕设备 (小于 576px) - 手机竖屏 */
@media (max-width: 575.98px) {
  /* 保持两行三列，但缩小尺寸 */
  .hero-title {
    font-size: clamp(2rem, 8vw, 2.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(0.9rem, 4vw, 1.1rem) !important;
  }
  
  .display-4 {
    font-size: clamp(1.5rem, 6vw, 2rem) !important;
  }
  
  /* 保持三列网格，但元素更小 */
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.5rem;
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
  
  .feature-icon {
    width: 50px !important;
    height: 50px !important;
    font-size: 1.2rem !important;
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

/* 小屏幕设备 (576px - 767.98px) - 手机横屏/小平板 */
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
  
  /* 保持三列网格 */
  .news-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1rem;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
  
  .feature-icon {
    width: 60px !important;
    height: 60px !important;
    font-size: 1.3rem !important;
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
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1.5rem;
  }
  
  .feature-icon {
    width: 65px !important;
    height: 65px !important;
    font-size: 1.4rem !important;
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
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.8rem;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 1.8rem;
  }
  
  .feature-icon {
    width: 70px !important;
    height: 70px !important;
    font-size: 1.5rem !important;
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
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2rem;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 2rem;
  }
  
  .feature-icon {
    width: 75px !important;
    height: 75px !important;
    font-size: 1.6rem !important;
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
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 2.5rem;
  }
  
  .footer-content {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 2.5rem;
  }
  
  .feature-icon {
    width: 80px !important;
    height: 80px !important;
    font-size: 1.8rem !important;
  }
}

html {
  scroll-behavior: smooth;
}

</style>