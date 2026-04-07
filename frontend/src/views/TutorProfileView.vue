<template>
  <main class="profile-page">

    <!-- profile header - red gradient banner with avatar and name -->
    <header class="profile-header">
      <div class="profile-header-content">
        <!-- back navigation to tutors list -->
        <router-link to="/tutors" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to All Tutors
        </router-link>

        <div class="profile-main">
          <!-- todo: replace initials with actual profile photo -->
          <div class="profile-avatar">{{ tutor.initials }}</div>
          <div class="profile-info">
            <!-- badges: availability status + role -->
            <div class="profile-badges">
              <span v-if="tutor.available" class="profile-badge available">Available Now</span>
              <span class="profile-badge">{{ tutor.role }}</span>
            </div>
            <h1 class="profile-name">{{ tutor.name }}</h1>
            <p class="profile-role">{{ tutor.tagline }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- profile body - two column layout (main + sidebar) -->
    <div class="profile-body">

      <!-- left column: about, schedule, courses -->
      <div class="profile-main-content">

        <!-- about card - bio paragraphs and stats -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>About Me</h2>
          </div>
          <div class="card-body">
            <div class="about-text">
              <p v-for="(paragraph, i) in tutor.aboutParagraphs" :key="i">{{ paragraph }}</p>
            </div>
            <div class="stats-grid">
              <div class="stat-item" v-for="stat in tutor.stats" :key="stat.label">
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- schedule card - shows this tutor's weekly availability -->
        <!-- todo: pull schedule from api instead of hardcoded data -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2>This Week's Schedule</h2>
          </div>
          <div class="card-body">
            <div class="schedule-list">
              <!-- each slot shows day, time range, and location -->
              <div
                v-for="slot in tutor.schedule"
                :key="slot.day + slot.time"
                class="schedule-item"
                :class="{ today: slot.isToday }"
              >
                <div class="schedule-day">
                  <div class="schedule-day-name">{{ slot.dayShort }}</div>
                  <div class="schedule-day-date">{{ slot.date }}</div>
                </div>
                <div class="schedule-details">
                  <div class="schedule-time">{{ slot.time }}</div>
                  <div class="schedule-location">{{ slot.location }}</div>
                </div>
                <span v-if="slot.isToday" class="today-tag">Today</span>
              </div>
            </div>
          </div>
        </div>

        <!-- courses card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h2>Courses I Can Help With</h2>
          </div>
          <div class="card-body">
            <div class="courses-grid">
              <div
                v-for="course in tutor.courseDetails"
                :key="course.code"
                class="course-item"
              >
                <span class="course-code">{{ course.code }}</span>
                <div class="course-info">
                  <div class="course-name">{{ course.name }}</div>
                  <div class="course-desc">{{ course.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- right column: sidebar with quick info and cta -->
      <div class="profile-sidebar">

        <!-- quick info card - location, how to find, experience -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2>Quick Info</h2>
          </div>
          <div class="card-body">
            <div class="quick-info">
              <div class="quick-info-item">
                <div class="quick-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div class="quick-info-text">
                  <div class="quick-info-label">Location</div>
                  <div class="quick-info-value">Smith Building, Common Area</div>
                </div>
              </div>
              <div class="quick-info-item">
                <div class="quick-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="quick-info-text">
                  <div class="quick-info-label">How to Find Me</div>
                  <div class="quick-info-value">Look for the red vest!</div>
                </div>
              </div>
              <div class="quick-info-item">
                <div class="quick-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                </div>
                <div class="quick-info-text">
                  <div class="quick-info-label">Experience Level</div>
                  <div class="quick-info-value">{{ tutor.role }} ({{ tutor.stats[0].value }})</div>
                </div>
              </div>
              <div class="quick-info-item">
                <div class="quick-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="quick-info-text">
                  <div class="quick-info-label">Specialization</div>
                  <div class="quick-info-value">{{ tutor.specialization }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- call-to-action card - changes message based on availability -->
        <div class="profile-card cta-card">
          <div class="card-body cta-body">
            <h3>Need Help Today?</h3>
            <!-- show different message depending on if tutor is available now -->
            <p>{{ tutor.available ? "I'm currently available in Smith Building. Just walk in — no appointment needed!" : "Check the schedule to see when I'm next available." }}</p>
            <router-link to="/schedule" class="cta-btn">
              View Full Schedule
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>

      </div>
    </div>

  </main>
</template>

<script>
import { tutorService } from '@/services/tutors'

// day name helpers for transforming the api schedule into display format
const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri' }
const DAY_INDEX = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4 }

export default {
  name: 'TutorProfileView',

  data() {
    return {
      tutor: null // gets set in created() from api
    }
  },

  // load tutor data from the api when component is created
  async created() {
    const slug = this.$route.params.slug

    try {
      const data = await tutorService.getBySlug(slug)

      // transform the api schedule into what the template expects
      // api gives { dayName, time, location } - we need { dayShort, date, isToday }
      const today = new Date()
      const todayDayOfWeek = today.getDay() // 0=sun, 1=mon...
      const mondayOffset = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek
      const monday = new Date(today)
      monday.setDate(today.getDate() + mondayOffset)

      const schedule = data.schedule.map(slot => {
        const dayIdx = DAY_INDEX[slot.dayName] ?? 0
        const slotDate = new Date(monday)
        slotDate.setDate(monday.getDate() + dayIdx)

        const isToday =
          slotDate.getDate() === today.getDate() &&
          slotDate.getMonth() === today.getMonth() &&
          slotDate.getFullYear() === today.getFullYear()

        return {
          dayShort: DAY_SHORT[slot.dayName] || slot.dayName.slice(0, 3),
          date: String(slotDate.getDate()),
          time: slot.time,
          location: slot.location,
          isToday
        }
      })

      this.tutor = { ...data, schedule }
    } catch (err) {
      // tutor not found or api error - go back to tutors list
      this.$router.push('/tutors')
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}

/* profile header */
.profile-header {
  padding: 120px 48px 0;
  background: linear-gradient(135deg, var(--utu-red) 0%, var(--utu-red-dark) 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.profile-header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 32px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: white;
}

.profile-main {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  padding-bottom: 80px;
}

.profile-avatar {
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 700;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
}

.profile-badge.available::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.profile-name {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.1;
}

.profile-role {
  font-size: 18px;
  opacity: 0.9;
}

/* profile body */
.profile-body {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 48px 60px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  position: relative;
}

.profile-main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* cards */
.profile-card {
  background: var(--warm-white);
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.card-header {
  padding: 24px 28px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
}

.card-icon {
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--utu-red);
}

.card-body {
  padding: 28px;
}

/* about section */
.about-text {
  font-size: 16px;
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: 24px;
}

.about-text p {
  margin-bottom: 16px;
}

.about-text p:last-child {
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--utu-red);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--gray-400);
}

/* schedule section */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--gray-100);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.schedule-item:hover {
  background: var(--gray-200);
}

.schedule-item.today {
  background: rgba(186, 28, 33, 0.08);
  border: 1px solid rgba(186, 28, 33, 0.2);
}

.schedule-day {
  width: 60px;
  text-align: center;
}

.schedule-day-name {
  font-size: 12px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.schedule-day-date {
  font-size: 24px;
  font-weight: 700;
  color: var(--navy);
}

.schedule-item.today .schedule-day-name,
.schedule-item.today .schedule-day-date {
  color: var(--utu-red);
}

.schedule-details {
  flex: 1;
}

.schedule-time {
  font-size: 16px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 4px;
}

.schedule-location {
  font-size: 13px;
  color: var(--gray-400);
}

.today-tag {
  background: var(--utu-red);
  color: white;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

/* courses section */
.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--gray-100);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.course-item:hover {
  background: var(--gray-200);
}

.course-code {
  background: var(--navy);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.course-info {
  flex: 1;
}

.course-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 2px;
}

.course-desc {
  font-size: 13px;
  color: var(--gray-400);
}

/* sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* quick info */
.quick-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.quick-info-icon {
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--utu-red);
  flex-shrink: 0;
}

.quick-info-text {
  flex: 1;
}

.quick-info-label {
  font-size: 12px;
  color: var(--gray-400);
  margin-bottom: 4px;
}

.quick-info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
}

/* CTA card */
.cta-card {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  color: white;
  border: none;
}

.cta-body {
  text-align: center;
}

.cta-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.cta-card p {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 20px;
  line-height: 1.6;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--utu-red);
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
}

.cta-btn:hover {
  background: var(--utu-red-light);
  transform: translateY(-2px);
}

/* responsive */
@media (max-width: 1024px) {
  .profile-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 100px 24px 0;
  }

  .profile-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 60px;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
    font-size: 40px;
  }

  .profile-badges {
    justify-content: center;
  }

  .profile-name {
    font-size: 32px;
  }

  .profile-body {
    padding: 0 24px 40px;
    margin-top: -24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .card-header {
    padding: 20px;
  }

  .card-body {
    padding: 20px;
  }
}
</style>
