import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsView from '../views/NewsView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import CreateActivityView from '../views/CreateActivityView.vue'
import MyActivityView from '../views/MyActivityView.vue'
import ActivityInfoView from '../views/ActivityInfoView.vue'
import FirebaseSignInView from '../views/FirebaseSignInView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ApiTestView from '../views/ApiTestView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/news',
    name: 'News',
    component: NewsView,
  },
  {
    path: '/activities',
    name: 'Activities',
    component: ActivitiesView,
  },
  {
    path: '/activities/:id',
    name: 'ActivityInfo',
    component: ActivityInfoView,
  },
  {
    path: '/create-activity',
    name: 'CreateActivity',
    component: CreateActivityView,
  },
  {
    path: '/my-activities',
    name: 'MyActivities',
    component: MyActivityView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/api-test',
    name: 'ApiTest',
    component: ApiTestView,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: FirebaseSignInView,
  },
  {
    path: '/register',
    name: 'Register',
    component: FirebaseRegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
