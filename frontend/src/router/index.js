// vue router config - defines all the pages and their urls
// uses lazy loading (dynamic imports) for everything except the home page
// so the browser only downloads the code for each page when you visit it

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // uses browser history api for clean urls (no hash #)
  history: createWebHistory(import.meta.env.BASE_URL),

  // always scroll to the top when navigating to a new page
  scrollBehavior() {
    return { top: 0 }
  },

  routes: [
    // public pages - visible to everyone
    { path: '/', name: 'home', component: HomeView },
    { path: '/schedule', name: 'schedule', component: () => import('../views/ScheduleView.vue') },
    { path: '/tutors', name: 'tutors', component: () => import('../views/TutorsView.vue') },
    { path: '/courses', name: 'courses', component: () => import('../views/CoursesView.vue') },
    { path: '/tutors/:slug', name: 'tutor-profile', component: () => import('../views/TutorProfileView.vue') },

    // tv display - full screen, no nav/footer (hideChrome hides them in App.vue)
    { path: '/tv', name: 'tv-display', component: () => import('../views/TVDisplayView.vue'), meta: { hideChrome: true } },

    // auth pages
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },

    // dashboard - full screen layout with its own sidebar nav
    // todo: add route guard to redirect to /login if not authenticated
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/TutorDashboardView.vue'), meta: { hideChrome: true } }
  ]
})

export default router
