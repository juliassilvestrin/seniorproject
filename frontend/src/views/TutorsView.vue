<template>
  <main class="tutors-page">

    <PageHeader
      title="Our Tutors"
      description="Meet the team ready to help you succeed. All our tutors are experienced students who've excelled in these courses."
    />

    <!-- filter bar - sticky search + course chip filters -->
    <div class="filter-bar">
      <div class="filter-content">
        <SearchBox
          v-model="searchQuery"
          placeholder="Search tutors by name..."
        />
        <!-- course filter chips - clicking one filters the tutor grid -->
        <div class="filter-chips">
          <span class="filter-label">Filter by course:</span>
          <button
            class="filter-chip"
            :class="{ active: selectedCourse === '' }"
            @click="selectedCourse = ''"
          >
            All
          </button>
          <button
            v-for="course in allCourses"
            :key="course"
            class="filter-chip"
            :class="{ active: selectedCourse === course }"
            @click="selectedCourse = course"
          >
            {{ course }}
          </button>
        </div>
      </div>
    </div>

    <!-- tutors grid - cards are clickable and go to profile page -->
    <div class="tutors-container">
      <div class="tutors-grid">
        <TutorCard
          v-for="tutor in filteredTutors"
          :key="tutor.name"
          :name="tutor.name"
          :initials="tutor.initials"
          :photo="tutor.photo"
          :role="tutor.role"
          :bio="tutor.bio"
          :courses="tutor.courses"
          :available="tutor.available"
          :nextAvailable="tutor.nextAvailable"
          variant="light"
          @click="goToProfile(tutor)"
        />
      </div>

      <!-- empty state - shows when search/filter returns nothing -->
      <div v-if="filteredTutors.length === 0" class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>No tutors found</h3>
        <p>Try adjusting your search or filter criteria.</p>
        <button class="reset-btn" @click="resetFilters">Reset Filters</button>
      </div>
    </div>

  </main>
</template>

<script>
import PageHeader from '../components/PageHeader.vue'
import TutorCard from '../components/TutorCard.vue'
import SearchBox from '../components/SearchBox.vue'
import { tutorService } from '@/services/tutors'

export default {
  name: 'TutorsView',

  components: {
    PageHeader,
    TutorCard,
    SearchBox
  },

  data() {
    return {
      searchQuery: '',       // text from the search box
      selectedCourse: '',    // currently selected course chip
      tutors: [],            // loaded from api
      isLoading: true
    }
  },

  async created() {
    try {
      this.tutors = await tutorService.getAll()
    } catch (err) {
      console.error('failed to load tutors:', err)
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    // pull unique courses from all tutors for the filter chips
    allCourses() {
      const courses = new Set()
      this.tutors.forEach(tutor => {
        tutor.courses.forEach(c => courses.add(c))
      })
      return [...courses].sort()
    },

    // filter tutors by search text and selected course
    filteredTutors() {
      return this.tutors.filter(tutor => {
        const nameMatch = tutor.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const courseMatch = !this.selectedCourse || tutor.courses.includes(this.selectedCourse)
        return nameMatch && courseMatch
      })
    }
  },

  methods: {
    // clear all filters back to defaults
    resetFilters() {
      this.searchQuery = ''
      this.selectedCourse = ''
    },

    // navigate to the tutor's profile page using the slug from the api
    goToProfile(tutor) {
      const slug = tutor.slug || tutor.name.toLowerCase().replace(/\s+/g, '-')
      this.$router.push({ name: 'tutor-profile', params: { slug } })
    }
  }
}
</script>

<style scoped>
.tutors-page {
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
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.filter-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-600);
  margin-right: 8px;
}

.filter-chip {
  padding: 6px 14px;
  border: 1px solid var(--gray-200);
  border-radius: 100px;
  background: var(--warm-white);
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--gray-400);
  color: var(--navy);
}

.filter-chip.active {
  background: var(--navy);
  border-color: var(--navy);
  color: white;
}

/* tutors grid */
.tutors-container {
  padding: 40px 48px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.tutors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
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
@media (max-width: 1024px) {
  .tutors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-bar {
    padding: 16px 24px;
  }

  .filter-label {
    display: none;
  }

  .tutors-container {
    padding: 24px 24px 60px;
  }
  

  .tutors-grid {
    grid-template-columns: 1fr;
  }
}
</style>