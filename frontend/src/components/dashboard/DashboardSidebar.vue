<template>
  <!-- dashboard sidebar navigation - fixed on the left side -->
  <aside class="sidebar">
    <!-- logo at the top, links back to public site -->
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-logo">
        <div class="sidebar-logo-icon">TC</div>
        <span class="sidebar-logo-text">Tutoring Center</span>
      </router-link>
    </div>

    <!-- logged in user info card -->
    <div class="sidebar-user">
      <div class="user-card">
        <div class="user-avatar">{{ user.initials }}</div>
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.role }}</p>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- main section - available to all tutors -->
      <div class="nav-section">
        <div class="nav-label">Main</div>
        <!-- dashboard overview -->
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeSection === 'overview' }"
          @click.prevent="$emit('navigate', 'overview')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </a>
        <!-- schedule management -->
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeSection === 'schedule' }"
          @click.prevent="$emit('navigate', 'schedule')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          My Schedule
        </a>
        <!-- profile editing -->
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeSection === 'profile' }"
          @click.prevent="$emit('navigate', 'profile')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Edit Profile
        </a>
      </div>

      <!-- manage section -->
      <div class="nav-section">
        <div class="nav-label">Manage</div>
        <!-- absence reporting - available to all tutors -->
        <a
          href="#"
          class="nav-item"
          :class="{ active: activeSection === 'absences' }"
          @click.prevent="$emit('navigate', 'absences')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Mark Absence
        </a>

        <!-- admin-only items - hidden for regular tutors -->
        <template v-if="isAdmin">
          <!-- manage all tutors -->
          <a
            href="#"
            class="nav-item"
            :class="{ active: activeSection === 'admin-tutors' }"
            @click.prevent="$emit('navigate', 'admin-tutors')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Manage Tutors
          </a>
          <!-- manage courses list -->
          <a
            href="#"
            class="nav-item"
            :class="{ active: activeSection === 'admin-courses' }"
            @click.prevent="$emit('navigate', 'admin-courses')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Manage Courses
          </a>
          <!-- invite code management -->
          <a
            href="#"
            class="nav-item"
            :class="{ active: activeSection === 'admin-invites' }"
            @click.prevent="$emit('navigate', 'admin-invites')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Invite Codes
          </a>
        </template>
      </div>

      <!-- view section - links out to public pages -->
      <div class="nav-section">
        <div class="nav-label">View</div>
        <!-- link back to public website -->
        <router-link to="/" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Public Website
        </router-link>
        <!-- tv display mode - admin only, opens in new tab -->
        <a
          v-if="isAdmin"
          href="/tv"
          target="_blank"
          class="nav-item"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
          TV Display
          <!-- external link indicator -->
          <svg class="external-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </nav>

    <!-- sign out button at the bottom -->
    <div class="sidebar-footer">
      <!-- todo: hook this up to actual auth logout -->
      <button class="logout-btn" @click="$emit('logout')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'DashboardSidebar',

  props: {
    // logged in user object with name, initials, role
    user: {
      type: Object,
      required: true
    },
    // tracks which sidebar item is currently selected
    activeSection: {
      type: String,
      default: 'overview'
    },
    // controls visibility of admin-only nav items
    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  // navigate switches dashboard panels, logout signs out
  emits: ['navigate', 'logout']
}
</script>

<style scoped>
.sidebar {
  background: var(--navy);
  color: white;
  padding: 32px 0;
  position: fixed;
  width: 260px;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 50;
}

.sidebar-header {
  padding: 0 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
}

.sidebar-logo-icon {
  width: 40px;
  height: 40px;
  background: var(--utu-red);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.sidebar-logo-text {
  font-size: 20px;
  font-weight: 600;
}

.sidebar-user {
  padding: 0 24px;
  margin-bottom: 32px;
}

.user-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--utu-red-light) 0%, var(--utu-red) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.user-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.user-info p {
  font-size: 13px;
  opacity: 0.6;
}

.sidebar-nav {
  padding: 0 12px;
  flex: 1;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.active {
  background: var(--utu-red);
  color: white;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.external-icon {
  margin-left: auto;
  opacity: 0.5;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>