<template>
  <main class="home">

    <!-- hero section - main landing area with cta buttons -->
    <section class="hero">
      <div class="hero-content">

        <!-- left side: headline, description, and navigation buttons -->
        <div class="hero-text">
          <!-- animated badge with pulsing dot -->
          <div class="hero-badge">
            <span>Free Walk-in Tutoring</span>
          </div>

          <h1>Get Help with Your <span class="highlight">CS Courses</span></h1>

          <p>Connect with experienced tutors at Utah Tech University's Department of Computing. Walk-in help available in Smith Building — look for the red vests.</p>

          <div class="hero-buttons">
            <router-link to="/schedule" class="btn-primary">View Schedule</router-link>
            <router-link to="/tutors" class="btn-secondary">Meet Our Tutors</router-link>
          </div>
        </div>

        <!-- right side: weekly schedule preview card - built from api data -->
        <div class="hero-card">
          <div class="week-card">
            <div class="week-card-header">
              <span class="week-title">This Week</span>
              <span class="week-month">{{ weekMonth }}</span>
            </div>

            <div class="week-days">
              <div
                v-for="day in weekDays"
                :key="day.name"
                class="day"
                :class="{ active: day.isToday }"
              >
                <span class="day-name">{{ day.name }}</span>
                <span class="day-num">{{ day.date }}</span>
                <span class="day-tutors">{{ day.count }} {{ day.count === 1 ? 'tutor' : 'tutors' }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- features section - grid of selling points for the service -->
    <section class="features">
      <div class="features-inner">
        <p class="section-label">why use our service</p>
        <h2 class="section-title">Everything you need to succeed in your CS courses</h2>

        <div class="features-grid">

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Real-time Schedules</h3>
            <p>Always know when tutors are available. Our schedule updates instantly when tutors make changes or mark absences.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>Find the Right Tutor</h3>
            <p>Filter by course to find tutors who specialize in exactly what you need help with, from CS 1400 to advanced topics.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h3>Access Anywhere</h3>
            <p>Check schedules from home, on campus, or anywhere. Our mobile-friendly site works on any device.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h3>No Wasted Trips</h3>
            <p>Plan your visit before heading to Smith Building. Know exactly who's available and when.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>Red Vest Tutors</h3>
            <p>Our tutors wear red vests so you can easily find them in the Smith Building common area.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>100% Free</h3>
            <p>All tutoring services are completely free for Utah Tech computing students. Just walk in!</p>
          </div>

        </div>
      </div>
    </section>

    <!-- tutors on duty section - dark bg with currently available tutors -->
    <section class="on-duty">
      <div class="on-duty-inner">

        <div class="on-duty-header">
          <p class="section-label gold">available today</p>
          <h2 class="section-title white">Tutors on duty right now</h2>
        </div>

        <!-- loop through tutors that are on duty today -->
        <div class="tutor-grid">
          <TutorCard
            v-for="tutor in tutorsOnDuty"
            :key="tutor.name"
            :name="tutor.name"
            :initials="tutor.initials"
            :photo="tutor.photo"
            :time="tutor.time"
            :courses="tutor.courses"
            variant="dark"
          />
        </div>

        <div class="on-duty-footer">
          <router-link to="/schedule" class="view-all-link">View full schedule →</router-link>
        </div>

      </div>
    </section>

    <!-- location section - map placeholder and building info -->
    <section class="location">
      <div class="location-inner">

        <!-- embedded google maps iframe + directions button below -->
        <div class="location-map">
          <iframe
            src="https://maps.google.com/maps?q=Smith+Computer+Center+225+S+700+E+St+George+UT+84770&t=&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style="border:0; border-radius: 24px 24px 0 0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <a
            href="https://maps.google.com/?q=Smith+Computer+Center+225+S+700+E+St+George+UT+84770"
            target="_blank"
            rel="noopener"
            class="map-directions-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Get Directions
          </a>
        </div>

        <div class="location-details">
          <p class="section-label">find us</p>
          <h2>Smith Building Common Area</h2>

          <div class="location-info">

            <div class="location-item">
              <div class="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--utu-red)" stroke-width="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div>
                <h4>Location</h4>
                <p>Smith Computer Center, 225 S 700 E<br>St. George, UT 84770</p>
              </div>
            </div>

            <div class="location-item">
              <div class="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--utu-red)" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h4>Building Hours</h4>
                <p>Mon – Fri: 8:00 AM – 10:00 PM<br>Saturday: 10:00 AM – 5:00 PM<br>Sunday: Closed</p>
              </div>
            </div>

            <div class="location-item">
              <div class="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--utu-red)" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h4>How to Find Us</h4>
                <p>Look for students wearing red vests — they're here to help!</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

  </main>
</template>

<script>
import TutorCard from '../components/TutorCard.vue'
import { scheduleService } from '@/services/schedule'

export default {
  name: 'HomeView',

  components: {
    TutorCard
  },

  data() {
    return {
      tutorsOnDuty: [],
      weekDays: [],
      weekMonth: ''
    }
  },

  async created() {
    await this.loadScheduleData()
  },

  methods: {
    async loadScheduleData() {
      try {
        const slots = await scheduleService.getAll()

        const today = new Date()
        const jsDay = today.getDay() // 0=sun, 1=mon...6=sat
        const todayIndex = jsDay === 0 || jsDay === 6 ? -1 : jsDay - 1

        // figure out monday of this week
        const monday = new Date(today)
        monday.setDate(today.getDate() - (jsDay === 0 ? 6 : jsDay - 1))

        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        this.weekMonth = `${months[monday.getMonth()]} ${monday.getFullYear()}`

        const dayNames = ['MON','TUE','WED','THU','FRI']
        this.weekDays = dayNames.map((name, i) => {
          const d = new Date(monday)
          d.setDate(monday.getDate() + i)
          return {
            name,
            date: d.getDate(),
            isToday: i === todayIndex,
            count: slots.filter(s => s.dayIndex === i).length
          }
        })

        // tutors on duty today
        if (todayIndex !== -1) {
          this.tutorsOnDuty = slots
            .filter(s => s.dayIndex === todayIndex)
            .map(s => ({
              name: s.tutor,
              initials: s.initials,
              photo: s.photo || '',
              time: s.time,
              courses: s.courses
            }))
        }
      } catch (err) {
        console.error('failed to load schedule data:', err)
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* hero - added more top padding */
.hero {
  padding: 180px 48px 100px;
  background: linear-gradient(180deg, var(--warm-white) 0%, var(--cream) 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(186, 28, 33, 0.08);
  color: var(--utu-red);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

.hero-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--utu-red);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero h1 {
  font-size: 64px;
  line-height: 1.1;
  color: var(--navy);
  margin-bottom: 24px;
  font-weight: 700;
}

.hero h1 .highlight {
  color: var(--utu-red);
}

.hero-text p {
  font-size: 20px;
  color: var(--gray-600);
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 160px;
}

.btn-primary {
  background: var(--utu-red);
  color: white;
  border: 2px solid var(--utu-red);
}

.btn-primary:hover {
  background: var(--utu-red-dark);
  border-color: var(--utu-red-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--navy);
  border: 2px solid var(--navy);
}

.btn-secondary:hover {
  background: var(--navy);
  color: white;
  transform: translateY(-2px);
}

.hero-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.week-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  width: 100%;
  max-width: 460px;
}

.week-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.week-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
}

.week-month {
  font-size: 14px;
  color: var(--gray-400);
}

.week-days {
  display: flex;
  gap: 8px;
}

.day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 12px;
  background: var(--gray-100);
}

.day.active {
  background: var(--utu-red);
  color: white;
}

.day-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.day.active .day-name {
  opacity: 1;
}

.day-num {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.day-tutors {
  font-size: 11px;
  opacity: 0.8;
  text-align: center;
}

.day-tag {
  font-size: 10px;
  font-weight: 600;
  background: rgba(26, 31, 54, 0.08);
  color: var(--navy);
  padding: 3px 6px;
  border-radius: 4px;
  text-align: center;
}

/* features */
.features {
  padding: 100px 48px;
  background: var(--cream);
}

.features-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--utu-red);
  margin-bottom: 12px;
}

.section-label.gold {
  color: var(--accent-gold);
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 60px;
  max-width: 600px;
  line-height: 1.2;
}

.section-title.white {
  color: white;
  margin-bottom: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 36px;
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: rgba(186, 28, 33, 0.06);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--utu-red);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 15px;
  color: var(--gray-600);
  line-height: 1.7;
}

/* tutors on duty */
.on-duty {
  padding: 80px 48px;
  background: var(--navy);
}

.on-duty-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.on-duty-header {
  margin-bottom: 48px;
}

.on-duty-footer {
  margin-top: 40px;
  text-align: center;
}

.view-all-link {
  color: var(--accent-gold);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: opacity 0.2s ease;
}

.view-all-link:hover {
  opacity: 0.8;
}

.tutor-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* location */
.location {
  padding: 100px 48px;
  background: var(--cream);
}

.location-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.location-map {
  border-radius: 24px;
  height: 400px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-200);
}

.map-directions-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--navy);
  color: white;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 24px 24px;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.map-directions-btn:hover {
  background: var(--utu-red);
}

.location-details h2 {
  font-size: 36px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 32px;
  line-height: 1.2;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.location-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.location-icon {
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.location-item h4 {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.location-item p {
  font-size: 15px;
  color: var(--gray-600);
  line-height: 1.6;
}

/* mobile */
@media (max-width: 1024px) {
  .tutor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 140px 24px 60px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero-text p {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .features {
    padding: 60px 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .on-duty {
    padding: 60px 24px;
  }

  .on-duty-header {
    margin-bottom: 32px;
  }

  .tutor-grid {
    grid-template-columns: 1fr;
  }

  .location {
    padding: 60px 24px;
  }

  .location-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .location-map {
    height: 300px;
  }

  .section-title {
    font-size: 32px;
  }
}
</style>