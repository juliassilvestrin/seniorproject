<template>
  <!-- this page is designed to be displayed on a tv in smith building -->
  <!-- it has its own dark layout, no navbar, and auto-updates the time -->
  <div class="tv-container">

    <!-- header - branding and live tutor count -->
    <header class="tv-header">
      <div class="tv-branding">
        <div class="tv-logo">TC</div>
        <div class="tv-title">
          <h1>Tutoring Center</h1>
          <p>Department of Computing &bull; Utah Tech University</p>
        </div>
      </div>
      <!-- green dot pulses to show it's live -->
      <div class="tv-status">
        <div class="status-dot"></div>
        <span class="status-text">{{ tutorsAvailableNow }} Tutors Available Now</span>
      </div>
    </header>

    <!-- main content - schedule on left, qr code on right -->
    <main class="tv-main">

      <!-- schedule grid - shows all 5 weekdays -->
      <section class="schedule-section">
        <h2>THIS WEEK'S SCHEDULE</h2>
        <p class="schedule-date">{{ weekDateRange }}</p>

        <div class="schedule-grid">
          <div
            v-for="day in weekDays"
            :key="day.name"
            class="day-column"
            :class="{ today: day.isToday }"
          >
            <div class="day-header">
              <div class="day-name">{{ day.shortName }}</div>
              <div class="day-number">{{ day.date }}</div>
              <div class="tutor-count">{{ day.tutors.length }} {{ day.tutors.length === 1 ? 'tutor' : 'tutors' }}</div>
            </div>
            <div class="day-body">
              <div
                v-for="tutor in day.tutors"
                :key="tutor.name"
                class="tutor-slot"
              >
                <div class="tutor-slot-header">
                  <div class="slot-avatar">{{ tutor.initials }}</div>
                  <div class="slot-name">{{ tutor.name }}</div>
                </div>
                <div class="slot-time">{{ tutor.time }}</div>
                <div class="slot-courses">
                  <span
                    v-for="course in tutor.courses"
                    :key="course"
                    class="slot-course"
                  >{{ course }}</span>
                </div>
              </div>

              <div v-if="day.tutors.length === 0" class="no-tutors">
                <p>No tutors scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- qr code sidebar - scan to visit the website on your phone -->
      <aside class="qr-section">
        <!-- todo: replace svg placeholder with actual qr code image -->
        <div class="qr-card">
          <div class="qr-code">
            <!-- real qr code generated from the site url -->
            <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" width="200" height="200">
          </div>
          <div class="qr-label">Scan for More Info</div>
        </div>

        <div class="qr-instruction">
          <h3>Get Full Details</h3>
          <p>Scan to see tutor profiles, course specializations, and real-time availability</p>
          <div class="qr-url">tutoring.cs.utahtech.edu</div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="info-text">
              <h4>Location</h4>
              <p>Smith Computer Center</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="info-text">
              <h4>Find Us</h4>
              <p>Look for the red vests!</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="info-text">
              <h4>100% Free</h4>
              <p>No appointment needed</p>
            </div>
          </div>
        </div>

        <!-- equipment available for checkout -->
        <div class="equipment-card">
          <h4 class="equipment-title">Equipment Available for Checkout</h4>
          <div class="equipment-list">
            <div class="equipment-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              MacBook
            </div>
            <div class="equipment-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Linux Laptop
            </div>
            <div class="equipment-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="6" width="14" height="8" rx="2"/><path d="M23 8v4a2 2 0 0 1-2 2h-1V6h1a2 2 0 0 1 2 2z"/>
              </svg>
              Portable Battery
            </div>
            <div class="equipment-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="10" r="3"/><path d="M12 13v8"/><path d="M8 21h8"/>
              </svg>
              Computer Mouse
            </div>
          </div>
        </div>
      </aside>

    </main>

    <!-- footer - university branding and live clock -->
    <footer class="tv-footer">
      <div class="footer-brand">
        <span class="footer-logo">Utah Tech University</span>
        <div class="footer-divider"></div>
        <span class="footer-dept">Department of Computing</span>
      </div>
      <!-- clock updates every second via setInterval -->
      <div class="footer-time">{{ currentTime }}</div>
    </footer>

  </div>
</template>

<script>
import { scheduleService } from '@/services/schedule'
import QRCode from 'qrcode'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default {
  name: 'TVDisplayView',

  data() {
    return {
      currentTime: '',    // updates every second
      timeInterval: null, // I save this so I can cancel it when the page unmounts
      weekDays: [],       // schedule grouped by day
      qrCodeUrl: ''       // base64 image string from the qrcode library
    }
  },

  computed: {
    tutorsAvailableNow() {
      const today = this.weekDays.find(d => d.isToday)
      return today ? today.tutors.length : 0
    },

    // builds "April 7 - 11, 2026" for the schedule header
    weekDateRange() {
      if (this.weekDays.length === 0) return ''
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
      const today = new Date()
      const dayOfWeek = today.getDay()
      const monday = new Date(today)
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
      const friday = new Date(monday)
      friday.setDate(monday.getDate() + 4)
      return `${months[monday.getMonth()]} ${monday.getDate()} - ${friday.getDate()}, ${friday.getFullYear()}`
    }
  },

  async mounted() {
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 1000)
    await this.loadSchedule()
    await this.generateQrCode()
  },

  // clear the interval when leaving the page or it keeps running in the background
  beforeUnmount() {
    if (this.timeInterval) clearInterval(this.timeInterval)
  },

  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    },

    // toDataURL gives back a base64 string so I don't need to save any files
    async generateQrCode() {
      try {
        this.qrCodeUrl = await QRCode.toDataURL('https://tutoring.cs.utahtech.edu', {
          width: 200,
          margin: 1,
          color: { dark: '#1A1F36', light: '#FFFFFF' }
        })
      } catch (err) {
        console.error('failed to generate qr code:', err)
      }
    },

    // fetches all slots from the api and groups them into 5 day columns
    async loadSchedule() {
      try {
        const slots = await scheduleService.getAll()

        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

        this.weekDays = DAY_NAMES.map((name, i) => {
          const dayDate = new Date(monday)
          dayDate.setDate(monday.getDate() + i)

          const isToday =
            dayDate.getDate() === today.getDate() &&
            dayDate.getMonth() === today.getMonth() &&
            dayDate.getFullYear() === today.getFullYear()

          const dayTutors = slots
            .filter(s => s.dayIndex === i)
            .map(s => ({
              // shorten "Jane Smith" to "Jane S." to fit on the tv screen
              name: s.tutor.split(' ').map((w, idx) => idx === 0 ? w : w[0] + '.').join(' '),
              initials: s.initials,
              time: s.time,
              courses: s.courses
            }))

          return {
            name,
            shortName: DAY_SHORT[i],
            date: String(dayDate.getDate()),
            isToday,
            tutors: dayTutors
          }
        })
      } catch (err) {
        console.error('failed to load schedule for tv display:', err)
      }
    }
  }
}
</script>

<style scoped>
.tv-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  padding: 48px;
  background: linear-gradient(135deg, #1A1F36 0%, #0D1117 100%);
  color: white;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* header */
.tv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
}

.tv-branding {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tv-logo {
  width: 80px;
  height: 80px;
  background: var(--utu-red);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
}

.tv-title h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.1;
}

.tv-title p {
  font-size: 20px;
  opacity: 0.7;
}

.tv-status {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  border-radius: 16px;
}

.status-dot {
  width: 16px;
  height: 16px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
}

.status-text {
  font-size: 20px;
  font-weight: 600;
}

/* main layout */
.tv-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
}

/* schedule */
.schedule-section h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--accent-gold);
  letter-spacing: 1px;
}

.schedule-date {
  font-size: 18px;
  opacity: 0.6;
  margin-bottom: 32px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.day-column {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.day-column.today {
  background: rgba(186, 28, 33, 0.15);
  border-color: var(--utu-red);
  box-shadow: 0 0 40px rgba(186, 28, 33, 0.2);
}

.day-header {
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.day-column.today .day-header {
  background: var(--utu-red);
}

.day-name {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.day-column.today .day-name {
  opacity: 1;
}

.day-number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
}

.tutor-count {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 8px;
}

.day-body {
  padding: 20px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tutor-slot {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.tutor-slot-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.slot-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--utu-red-light) 0%, var(--utu-red) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.slot-name {
  font-size: 18px;
  font-weight: 600;
}

.slot-time {
  font-size: 15px;
  opacity: 0.6;
  margin-bottom: 10px;
}

.slot-courses {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.slot-course {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.no-tutors {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  opacity: 0.4;
  font-size: 14px;
}

/* QR section */
.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.qr-card {
  background: white;
  border-radius: 32px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.qr-code {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.qr-label {
  font-size: 16px;
  font-weight: 700;
  color: #1A1F36;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.qr-instruction h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.qr-instruction p {
  font-size: 18px;
  opacity: 0.7;
  line-height: 1.6;
  margin-bottom: 24px;
}

.qr-url {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-gold);
  display: inline-block;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
}

.info-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-text h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.info-text p {
  font-size: 14px;
  opacity: 0.7;
}

/* equipment */
.equipment-card {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
}

.equipment-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-gold);
  margin-bottom: 14px;
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  opacity: 0.85;
}

/* footer */
.tv-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
}

.footer-logo {
  font-size: 18px;
  font-weight: 700;
}

.footer-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
}

.footer-dept {
  font-size: 14px;
}

.footer-time {
  font-size: 48px;
  font-weight: 700;
  color: var(--accent-gold);
}

/* responsive for smaller TVs / testing on laptop */
@media (max-width: 1400px) {
  .tv-container {
    padding: 32px;
  }

  .tv-title h1 {
    font-size: 36px;
  }

  .schedule-grid {
    gap: 12px;
  }

  .day-number {
    font-size: 36px;
  }

  .day-body {
    min-height: 220px;
    padding: 16px;
  }

  .tutor-slot {
    padding: 12px;
  }

  .slot-name {
    font-size: 15px;
  }
}

@media (max-width: 1100px) {
  .tv-main {
    grid-template-columns: 1fr;
  }

  .qr-section {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
  }

  .info-cards {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .tv-container {
    padding: 24px;
  }

  .tv-header {
    flex-direction: column;
    gap: 16px;
  }

  .schedule-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-time {
    font-size: 32px;
  }
}
</style>
