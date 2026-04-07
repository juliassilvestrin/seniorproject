<template>
  <div class="dashboard-layout">

    <!-- sidebar nav - handles navigation between sections -->
    <DashboardSidebar
      :user="user"
      :active-section="activeSection"
      :is-admin="user.role === 'Admin'"
      @navigate="activeSection = $event"
      @logout="handleLogout"
    />

    <!-- main content area - changes based on active section -->
    <main class="main-content">

      <!-- page header - only shows on the overview page -->
      <header v-if="activeSection === 'overview'" class="page-header">
        <div class="page-title">
          <!-- grabs just the first name from the full name -->
          <h1>Welcome back, {{ user.name.split(' ')[0] }}!</h1>
          <p>Here's what's happening with your tutoring schedule</p>
        </div>
      </header>

      <!-- tutor sections - conditionally rendered based on sidebar selection -->

      <!-- overview: quick stats and upcoming schedule -->
      <DashboardOverview
        v-if="activeSection === 'overview'"
        @navigate="activeSection = $event"
      />

      <!-- schedule management: add/remove time slots -->
      <DashboardSchedule
        v-else-if="activeSection === 'schedule'"
      />

      <!-- profile editing: bio, courses, etc -->
      <DashboardProfile
        v-else-if="activeSection === 'profile'"
        :user="user"
      />

      <!-- absence reporting -->
      <DashboardAbsences
        v-else-if="activeSection === 'absences'"
      />

      <!-- admin-only sections below -->

      <!-- admin: manage all tutors -->
      <AdminTutors
        v-else-if="activeSection === 'admin-tutors'"
        @navigate="activeSection = $event"
      />

      <!-- admin: manage course list -->
      <AdminCourses
        v-else-if="activeSection === 'admin-courses'"
      />

      <!-- admin: generate and manage invite codes -->
      <AdminInviteCodes
        v-else-if="activeSection === 'admin-invites'"
      />

      <!-- mobile sidebar toggle button -->
      <button class="mobile-menu-btn" @click="sidebarOpen = !sidebarOpen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

    </main>

  </div>
</template>

<script>
// dashboard sub-components - each handles one section
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardOverview from '../components/dashboard/DashboardOverview.vue'
import DashboardSchedule from '../components/dashboard/DashboardSchedule.vue'
import DashboardProfile from '../components/dashboard/DashboardProfile.vue'
import DashboardAbsences from '../components/dashboard/DashboardAbsences.vue'

// admin-only components
import AdminTutors from '../components/dashboard/AdminTutors.vue'
import AdminCourses from '../components/dashboard/AdminCourses.vue'
import AdminInviteCodes from '../components/dashboard/AdminInviteCodes.vue'

export default {
  name: 'TutorDashboardView',

  components: {
    DashboardSidebar,
    DashboardOverview,
    DashboardSchedule,
    DashboardProfile,
    DashboardAbsences,
    AdminTutors,
    AdminCourses,
    AdminInviteCodes
  },

  data() {
    return {
      activeSection: 'overview',   // which section is currently shown
      sidebarOpen: false,          // for mobile sidebar toggle
      // user loaded from localStorage after login, then refreshed from api
      user: {
        name: '',
        initials: '',
        email: '',
        role: '',
        bio: '',
        specialization: '',
        courses: []
      }
    }
  },

  // load logged-in user when dashboard opens
  async created() {
    const { authService } = await import('@/services/auth')
    const stored = authService.getUser()
    if (!stored) {
      this.$router.push('/login')
      return
    }
    // start with token data immediately so the name shows up right away
    this.user = { ...this.user, ...stored }
    // then fetch full profile (bio, courses, specialization, etc)
    try {
      const profile = await authService.me()
      this.user = { ...this.user, ...profile }
    } catch (err) {
      console.error('failed to load full profile:', err)
    }
  },

  methods: {
    // logs out and redirects to login page
    async handleLogout() {
      const { authService } = await import('@/services/auth')
      authService.logout()
    }
  }
}
</script>

<style scoped>
/* layout */
.dashboard-layout {
  min-height: 100vh;
}

/* main content */
.main-content {
  margin-left: 260px;
  padding: 40px 48px;
  background: var(--gray-100);
  min-height: 100vh;
}

/* page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 6px;
  white-space: nowrap;
}

.page-title p {
  font-size: 15px;
  color: var(--gray-600);
}

/* mobile menu button */
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 200;
  width: 48px;
  height: 48px;
  background: var(--navy);
  color: white;
  border: none;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* responsive */
@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .main-content {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .page-title h1 {
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 20px;
    padding-top: 72px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
