<template>
  <div class="overview">

    <!-- stats grid - 4 cards showing key numbers -->
    <div class="stats-grid">
      <!-- shifts this week -->
      <div class="stat-card">
        <div class="stat-icon red">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-value">{{ schedule.length }}</div>
        <div class="stat-label">Shifts This Week</div>
      </div>
      <!-- total hours -->
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="stat-value">{{ totalHours }}</div>
        <div class="stat-label">Hours This Week</div>
      </div>
      <!-- courses count -->
      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="stat-value">{{ courseCount }}</div>
        <div class="stat-label">Courses</div>
      </div>
      <!-- upcoming absences count -->
      <div class="stat-card">
        <div class="stat-icon gold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-value">{{ absences.length }}</div>
        <!-- singular/plural handling -->
        <div class="stat-label">Upcoming {{ absences.length === 1 ? 'Absence' : 'Absences' }}</div>
      </div>
    </div>

    <!-- content grid - schedule on left, actions + absences on right -->
    <div class="content-grid">

      <!-- schedule preview card -->
      <div class="card">
        <div class="card-header">
          <h2>This Week's Schedule</h2>
          <a href="#" class="card-action" @click.prevent="$emit('navigate', 'schedule')">
            Manage Schedule
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div class="card-body">
          <!-- list of schedule slots for the week -->
          <div v-if="schedule.length > 0" class="schedule-list">
            <div
              v-for="slot in schedule"
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
              <!-- highlight badge for today's shift -->
              <span v-if="slot.isToday" class="today-tag">Today</span>
            </div>
          </div>
          <!-- empty state when no shifts -->
          <div v-else class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No shifts scheduled this week</p>
          </div>
        </div>
      </div>

      <!-- right column - quick actions and absences -->
      <div class="right-column">

        <!-- quick actions card -->
        <div class="card">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <!-- shortcut to edit profile -->
              <a href="#" class="quick-action" @click.prevent="$emit('navigate', 'profile')">
                <div class="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div class="quick-action-text">
                  <h3>Edit Profile</h3>
                  <p>Update bio, courses, photo</p>
                </div>
              </a>
              <!-- shortcut to manage schedule -->
              <a href="#" class="quick-action" @click.prevent="$emit('navigate', 'schedule')">
                <div class="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div class="quick-action-text">
                  <h3>Manage Schedule</h3>
                  <p>Add or edit time slots</p>
                </div>
              </a>
              <!-- shortcut to mark absence -->
              <a href="#" class="quick-action" @click.prevent="$emit('navigate', 'absences')">
                <div class="quick-action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="quick-action-text">
                  <h3>Mark Absence</h3>
                  <p>Report upcoming absence</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- upcoming absences preview -->
        <div class="card">
          <div class="card-header">
            <h2>Upcoming Absences</h2>
            <a href="#" class="card-action" @click.prevent="$emit('navigate', 'absences')">Add New</a>
          </div>
          <div class="card-body">
            <!-- list of reported absences -->
            <div v-if="absences.length > 0" class="absence-list">
              <div
                v-for="absence in absences"
                :key="absence.date"
                class="absence-item"
              >
                <div class="absence-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div class="absence-details">
                  <div class="absence-date">{{ absence.date }}</div>
                  <div class="absence-reason">{{ absence.reason }}</div>
                </div>
              </div>
            </div>
            <!-- empty state - no absences -->
            <div v-else class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>No upcoming absences</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { tutorService } from '@/services/tutors'

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default {
  name: 'DashboardOverview',

  emits: ['navigate'],

  data() {
    return {
      schedule: [],
      absences: [],
      courseCount: 0,
      totalHours: 0
    }
  },

  async created() {
    await Promise.all([this.loadSchedule(), this.loadAbsences(), this.loadUser()])
  },

  methods: {
    async loadSchedule() {
      try {
        const slots = await tutorService.getMySchedule()

        // figure out dates for the current week starting from monday
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

        // compute total hours from start/end times
        let hours = 0
        this.schedule = slots.map(slot => {
          const slotDate = new Date(monday)
          slotDate.setDate(monday.getDate() + slot.dayOfWeek)
          const isToday =
            slotDate.getDate() === today.getDate() &&
            slotDate.getMonth() === today.getMonth() &&
            slotDate.getFullYear() === today.getFullYear()

          // add up hours from each slot
          if (slot.startTime && slot.endTime) {
            const [sh, sm] = slot.startTime.split(':').map(Number)
            const [eh, em] = slot.endTime.split(':').map(Number)
            hours += (eh * 60 + em - (sh * 60 + sm)) / 60
          }

          return {
            id: slot.id,
            dayShort: DAY_SHORT[slot.dayOfWeek],
            date: String(slotDate.getDate()),
            time: slot.time,
            location: slot.location,
            isToday
          }
        })
        this.totalHours = Math.round(hours)
      } catch (err) {
        console.error('failed to load schedule:', err)
      }
    },

    async loadAbsences() {
      try {
        const data = await tutorService.getMyAbsences()
        this.absences = data.map(a => ({
          id: a.id,
          date: new Date(a.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          reason: a.reason || 'No reason provided'
        }))
      } catch (err) {
        console.error('failed to load absences:', err)
      }
    },

    async loadUser() {
      try {
        const { authService } = await import('@/services/auth')
        const profile = await authService.me()
        this.courseCount = (profile.courses || []).length
      } catch (err) {
        console.error('failed to load user:', err)
      }
    }
  }
}
</script>

<style scoped>
/* stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--warm-white);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--gray-200);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-icon.red { background: rgba(186, 28, 33, 0.1); color: var(--utu-red); }
.stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.stat-icon.green { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
.stat-icon.gold { background: rgba(212, 168, 83, 0.1); color: var(--accent-gold); }

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--gray-400);
}

/* content grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* cards */
.card {
  background: var(--warm-white);
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
}

.card-action {
  font-size: 14px;
  color: var(--utu-red);
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-action:hover { text-decoration: underline; }

.card-body { padding: 24px; }

/* schedule list */
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
}

.schedule-item.today {
  background: rgba(186, 28, 33, 0.08);
  border: 1px solid rgba(186, 28, 33, 0.2);
}

.schedule-day {
  width: 56px;
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
.schedule-item.today .schedule-day-date { color: var(--utu-red); }

.schedule-details { flex: 1; }

.schedule-time {
  font-size: 15px;
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

/* quick actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--gray-100);
  border-radius: 12px;
  text-decoration: none;
  color: var(--navy);
  transition: all 0.2s ease;
}

.quick-action:hover {
  background: var(--gray-200);
  transform: translateX(4px);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  background: var(--warm-white);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--utu-red);
  flex-shrink: 0;
}

.quick-action-text h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.quick-action-text p {
  font-size: 13px;
  color: var(--gray-400);
}

/* absences */
.absence-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.absence-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.1);
  border-radius: 12px;
}

.absence-icon {
  width: 40px;
  height: 40px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #DC2626;
  flex-shrink: 0;
}

.absence-details { flex: 1; }

.absence-date {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 2px;
}

.absence-reason {
  font-size: 13px;
  color: var(--gray-400);
}

/* empty state */
.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--gray-400);
}

.empty-state svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p { font-size: 14px; }

/* responsive */
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .content-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>