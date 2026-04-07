<template>
  <main class="schedule-page">

    <PageHeader
      title="Weekly Schedule"
      description="See when tutors are available this week. Plan your visit to avoid wasted trips to Smith Building."
    />

    <!-- week navigation and filter controls - sticky bar below navbar -->
    <div class="schedule-controls">
      <div class="controls-content">

        <!-- arrow buttons to go back/forward a week -->
        <div class="week-nav">
          <button class="week-nav-btn" @click="prevWeek">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div class="week-display">
            <div class="week-label">Current Week</div>
            <div class="week-dates">{{ weekRangeLabel }}</div>
          </div>
          <button class="week-nav-btn" @click="nextWeek">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <!-- course filter dropdown and jump-to-today button -->
        <div class="filter-group">
          <select class="filter-select" v-model="selectedCourse">
            <option value="">All Courses</option>
            <option v-for="course in allCourses" :key="course" :value="course">{{ course }}</option>
          </select>
          <button class="today-btn" @click="jumpToToday">Jump to Today</button>
        </div>

      </div>
    </div>

    <!-- schedule grid - one column per weekday (mon-fri) -->
    <div class="schedule-container">
      <div class="schedule-grid">

        <!-- each day gets its own column with header + tutor slots -->
        <div
          v-for="day in weekDays"
          :key="day.date"
          class="day-column"
          :class="{ today: day.isToday }"
        >
          <div class="day-header">
            <span v-if="day.isToday" class="today-badge">Today</span>
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.dateNum }}</div>
            <div class="day-month">{{ day.month }}</div>
            <!-- show how many tutors are scheduled after filtering -->
            <div class="tutor-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {{ filteredSlots(day).length }} {{ filteredSlots(day).length === 1 ? 'tutor' : 'tutors' }}
            </div>
          </div>

          <div class="day-body">
            <!-- show tutor slots if any match the filter -->
            <template v-if="filteredSlots(day).length > 0">
              <TutorSlot
                v-for="slot in filteredSlots(day)"
                :key="slot.tutor"
                :name="slot.tutor"
                :initials="slot.initials"
                :time="slot.time"
                :courses="slot.courses"
              />
            </template>

            <!-- empty state when no tutors for this day -->
            <div v-else class="no-tutors">
              <div class="no-tutors-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                </svg>
              </div>
              <p>No tutors scheduled</p>
            </div>
          </div>
        </div>

      </div>

      <!-- color key so users know what the highlights mean -->
      <div class="schedule-legend">
        <div class="legend-title">Legend</div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color today-color"></div>
            <span>Today</span>
          </div>
          <div class="legend-item">
            <div class="legend-color regular-color"></div>
            <span>Scheduled Day</span>
          </div>
          <div class="legend-item">
            <div class="legend-color empty-color"></div>
            <span>No Tutors</span>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import PageHeader from '../components/PageHeader.vue'
import TutorSlot from '../components/TutorSlot.vue'

export default {
  name: 'ScheduleView',

  components: {
    PageHeader,
    TutorSlot
  },

  data() {
    return {
      // tracks which week we're viewing (0 = current, -1 = last, 1 = next)
      weekOffset: 0,
      // currently selected course filter (empty = show all)
      selectedCourse: '',
      // schedule slots from the api
      schedule: [],
      isLoading: true
    }
  },

  async created() {
    try {
      const { scheduleService } = await import('@/services/schedule')
      this.schedule = await scheduleService.getAll()
    } catch (err) {
      console.error('failed to load schedule:', err)
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    // figure out monday of the current viewed week
    weekStart() {
      const today = new Date()
      const dayOfWeek = today.getDay()
      const monday = new Date(today)
      // handle sunday edge case (getDay returns 0 for sunday)
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
      monday.setDate(monday.getDate() + this.weekOffset * 7)
      return monday
    },

    // build array of day objects for mon-fri with date info
    weekDays() {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
      const today = new Date()

      return days.map((name, i) => {
        const date = new Date(this.weekStart)
        date.setDate(this.weekStart.getDate() + i)

        // check if this day is actually today
        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()

        return {
          name,
          dateNum: date.getDate(),
          month: months[date.getMonth()],
          date: date.toDateString(),
          dayIndex: i,
          isToday
        }
      })
    },

    // format the week range for display like "Mar 17 - Mar 21, 2026"
    weekRangeLabel() {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const start = this.weekStart
      const end = new Date(start)
      end.setDate(start.getDate() + 4)
      return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`
    },

    // collect all unique courses from the schedule for the filter dropdown
    allCourses() {
      const courses = new Set()
      this.schedule.forEach(slot => {
        slot.courses.forEach(c => courses.add(c))
      })
      return [...courses].sort()
    }
  },

  methods: {
    prevWeek() { this.weekOffset-- },
    nextWeek() { this.weekOffset++ },
    // reset week offset to go back to current week
    jumpToToday() { this.weekOffset = 0 },
    // filter tutor slots by day and selected course
    filteredSlots(day) {
      return this.schedule.filter(slot => {
        const dayMatch = slot.dayIndex === day.dayIndex
        const courseMatch = !this.selectedCourse || slot.courses.includes(this.selectedCourse)
        return dayMatch && courseMatch
      })
    }
  }
}
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
}

.schedule-controls {
  background: var(--warm-white);
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 48px;
  position: sticky;
  top: 72px;
  z-index: 10;
}

.controls-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.week-nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: var(--warm-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--navy);
}

.week-nav-btn:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.week-display {
  text-align: center;
}

.week-label {
  font-size: 11px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.week-dates {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 8px 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  background: var(--warm-white);
  cursor: pointer;
  min-width: 160px;
  color: var(--navy);
}

.filter-select:focus {
  outline: none;
  border-color: var(--utu-red);
}

.today-btn {
  padding: 8px 20px;
  background: var(--utu-red);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.today-btn:hover {
  background: var(--utu-red-dark);
}

.schedule-container {
  padding: 24px 48px 48px;
  max-width: 1400px;
  margin: 0 auto;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.day-column {
  background: var(--warm-white);
  border-radius: 16px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-column:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.day-column.today {
  border: 2px solid var(--utu-red);
}

.day-header {
  padding: 20px;
  background: var(--gray-100);
  text-align: center;
  position: relative;
}

.day-column.today .day-header {
  background: var(--utu-red);
  color: white;
}

.today-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-gold);
  color: var(--navy);
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-name {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
  opacity: 0.7;
}

.day-column.today .day-name {
  opacity: 1;
}

.day-date {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2px;
}

.day-month {
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 10px;
}

.day-column.today .day-month {
  opacity: 0.85;
}

.tutor-count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.day-column:not(.today) .tutor-count {
  background: var(--warm-white);
  color: var(--navy);
}

.day-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 240px;
}

.no-tutors {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--gray-400);
  text-align: center;
  gap: 10px;
}

.no-tutors p {
  font-size: 13px;
}

.schedule-legend {
  margin-top: 24px;
  padding: 16px 20px;
  background: var(--warm-white);
  border-radius: 12px;
  border: 1px solid var(--gray-200);
}

.legend-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 10px;
}

.legend-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-600);
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.today-color { background: var(--utu-red); }
.regular-color { background: var(--gray-200); }
.empty-color { background: var(--gray-100); border: 1px solid var(--gray-200); }

@media (max-width: 1200px) {
  .schedule-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .schedule-grid { grid-template-columns: repeat(2, 1fr); }
  .controls-content { flex-direction: column; align-items: stretch; }
  .week-nav { justify-content: center; }
  .filter-group { flex-direction: column; }
}

@media (max-width: 600px) {
  .schedule-controls, .schedule-container { padding-left: 20px; padding-right: 20px; }
  .schedule-grid { grid-template-columns: 1fr; }
  .day-body { min-height: auto; }
}
</style>