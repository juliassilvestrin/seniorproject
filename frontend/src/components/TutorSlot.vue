<template>
  <!-- compact tutor time slot used on the schedule page -->
  <div class="tutor-slot" @click="$emit('click')">
    <!-- tutor name and time -->
    <div class="tutor-slot-header">
      <div class="slot-avatar">{{ initials }}</div>
      <div class="slot-info">
        <h4>{{ name }}</h4>
        <div class="slot-time">
          <!-- clock icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          {{ time }}
        </div>
      </div>
    </div>
    <!-- course tags for what this tutor helps with -->
    <div class="slot-courses">
      <CourseTag
        v-for="course in courses"
        :key="course"
        :code="course"
        size="sm"
      />
    </div>
  </div>
</template>

<script>
import CourseTag from './CourseTag.vue'

export default {
  name: 'TutorSlot',
  components: {
    CourseTag
  },
  props: {
    // tutor's display name
    name: {
      type: String,
      required: true
    },
    // two-letter initials for the avatar
    initials: {
      type: String,
      required: true
    },
    // time range like "9:00 AM - 12:00 PM"
    time: {
      type: String,
      required: true
    },
    // array of course codes like ['CS 1400', 'CS 1410']
    courses: {
      type: Array,
      default: () => []
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.tutor-slot {
  background: var(--gray-100);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tutor-slot:hover {
  background: var(--gray-200);
}

.tutor-slot-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.slot-avatar {
  width: 38px;
  height: 38px;
  background: var(--utu-red);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.slot-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 2px;
}

.slot-time {
  font-size: 12px;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: 5px;
}

.slot-courses {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>