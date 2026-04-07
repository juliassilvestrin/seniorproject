<template>
  <main class="courses-page">

    <PageHeader
      title="Courses We Support"
      description="Browse courses with tutoring available. Click on any course to see which tutors can help and when they're available."
    />

    <!-- search bar - filters courses as you type -->
    <div class="filter-bar">
      <div class="filter-content">
        <SearchBox
          v-model="searchQuery"
          placeholder="Search by course code or name..."
        />
      </div>
    </div>

    <!-- courses list - each card expands to show tutors -->
    <div class="courses-container">
      <div class="courses-grid">
        <div
          v-for="course in filteredCourses"
          :key="course.code"
          class="course-card"
          :class="{ expanded: expandedCourse === course.code }"
          @click="toggleCourse(course.code)"
        >
          <!-- course header - always visible, shows code + name + tutor count -->
          <div class="course-header">
            <div class="course-code-badge">{{ course.code }}</div>
            <div class="course-info">
              <h3 class="course-name">{{ course.name }}</h3>
              <p class="course-description">{{ course.description }}</p>
            </div>
            <div class="course-meta">
              <div class="tutor-count">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>{{ course.tutors.length }} {{ course.tutors.length === 1 ? 'tutor' : 'tutors' }}</span>
              </div>
              <div class="expand-icon" :class="{ rotated: expandedCourse === course.code }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- expanded section: list of tutors for this course -->
          <!-- click.stop prevents the card from collapsing when clicking inside -->
          <div v-if="expandedCourse === course.code" class="course-tutors" @click.stop>
            <div class="tutors-divider"></div>
            <h4 class="tutors-heading">Available Tutors</h4>
            <div class="tutor-list">
              <!-- each tutor row is clickable and navigates to their profile -->
              <div
                v-for="tutor in course.tutors"
                :key="tutor.name"
                class="tutor-row"
                @click="goToProfile(tutor)"
              >
                <div class="tutor-avatar">{{ tutor.initials }}</div>
                <div class="tutor-info">
                  <div class="tutor-name">{{ tutor.name }}</div>
                  <div class="tutor-role">{{ tutor.role }}</div>
                </div>
                <div class="tutor-availability" :class="{ available: tutor.available }">
                  <div class="availability-dot"></div>
                  <span>{{ tutor.available ? 'Available Now' : tutor.nextAvailable }}</span>
                </div>
                <div class="tutor-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- empty state -->
      <div v-if="filteredCourses.length === 0" class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>No courses found</h3>
        <p>Try adjusting your search criteria.</p>
        <button class="reset-btn" @click="searchQuery = ''">Clear Search</button>
      </div>
    </div>

  </main>
</template>

<script>
import PageHeader from '../components/PageHeader.vue'
import SearchBox from '../components/SearchBox.vue'
import { courseService } from '@/services/courses'

export default {
  name: 'CoursesView',

  components: {
    PageHeader,
    SearchBox
  },

  data() {
    return {
      searchQuery: '',       // search box text
      expandedCourse: null,  // which course card is open (null = none)
      courses: [],           // loaded from api
      isLoading: true
    }
  },

  async created() {
    try {
      this.courses = await courseService.getAll()
    } catch (err) {
      console.error('failed to load courses:', err)
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    // filter courses by search query - checks code, name, and description
    filteredCourses() {
      if (!this.searchQuery) return this.courses
      const q = this.searchQuery.toLowerCase()
      return this.courses.filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
    }
  },

  methods: {
    // toggle accordion - clicking same course closes it, different opens it
    toggleCourse(code) {
      this.expandedCourse = this.expandedCourse === code ? null : code
    },

    // navigate to the tutor's profile page
    goToProfile(tutor) {
      const slug = tutor.slug || tutor.name.toLowerCase().replace(/\s+/g, '-')
      this.$router.push({ name: 'tutor-profile', params: { slug } })
    }
  }
}
</script>

<style scoped>
.courses-page {
  min-height: 100vh;
}

/* filter bar */
.filter-bar {
  background: var(--warm-white);
  border-bottom: 1px solid var(--gray-200);
  padding: 20px 48px;
  position: sticky;
  top: 72px;
  z-index: 10;
}

.filter-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

/* courses list */
.courses-container {
  padding: 40px 48px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* course card */
.course-card {
  background: var(--warm-white);
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.course-card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.course-card.expanded {
  border-color: var(--utu-red);
  box-shadow: 0 4px 20px rgba(186, 28, 33, 0.08);
}

.course-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
}

.course-code-badge {
  background: var(--navy);
  color: white;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.course-description {
  font-size: 14px;
  color: var(--gray-400);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.tutor-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
  white-space: nowrap;
}

.tutor-count svg {
  color: var(--utu-red);
}

.expand-icon {
  color: var(--gray-400);
  transition: transform 0.2s ease;
  display: flex;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* expanded tutor section */
.course-tutors {
  padding: 0 28px 24px;
}

.tutors-divider {
  height: 1px;
  background: var(--gray-200);
  margin-bottom: 20px;
}

.tutors-heading {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-400);
  margin-bottom: 12px;
}

.tutor-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tutor-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--gray-100);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tutor-row:hover {
  background: var(--gray-200);
  transform: translateX(4px);
}

.tutor-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--utu-red-light) 0%, var(--utu-red) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.tutor-info {
  flex: 1;
}

.tutor-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
}

.tutor-role {
  font-size: 13px;
  color: var(--gray-400);
}

.tutor-availability {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-400);
}

.tutor-availability.available {
  color: #16A34A;
}

.availability-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-300);
}

.tutor-availability.available .availability-dot {
  background: #22C55E;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.tutor-arrow {
  color: var(--gray-300);
  display: flex;
}

.tutor-row:hover .tutor-arrow {
  color: var(--utu-red);
}

/* empty state */
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: var(--gray-400);
}

.no-results svg {
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 8px;
}

.no-results p {
  font-size: 14px;
  margin-bottom: 24px;
}

.reset-btn {
  padding: 10px 24px;
  background: var(--utu-red);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: var(--utu-red-dark);
}

/* responsive */
@media (max-width: 768px) {
  .filter-bar {
    padding: 16px 24px;
  }

  .courses-container {
    padding: 24px 24px 60px;
  }

  .course-header {
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px;
  }

  .course-info {
    flex-basis: 100%;
    order: 3;
  }

  .course-description {
    -webkit-line-clamp: 1;
  }

  .course-tutors {
    padding: 0 20px 20px;
  }

  .tutor-availability span {
    display: none;
  }
}
</style>
