<template>
  <!-- tutor card - used on both home page (dark) and tutors list (light) -->
  <div class="tutor-card" :class="variant" @click="$emit('click')">

    <!-- green "Available Now" badge, only shows on tutors list page -->
    <div v-if="available && variant === 'light'" class="availability-badge">
      Available Now
    </div>

    <!-- top section: avatar + name/role/time -->
    <div class="tutor-card-top">
      <img v-if="photo" :src="photo" class="tutor-avatar tutor-avatar-img" :alt="name">
      <div v-else class="tutor-avatar">{{ initials }}</div>
      <div class="tutor-info">
        <h4>{{ name }}</h4>
        <!-- role only shows on light variant (tutors list page) -->
        <span v-if="role && variant === 'light'" class="tutor-role">{{ role }}</span>
        <!-- time shows on both variants -->
        <span v-if="time" class="tutor-time">{{ time }}</span>
      </div>
    </div>

    <!-- bio and extra details only show on the full tutors list page cards -->
    <p v-if="bio && variant === 'light'" class="tutor-bio">{{ bio }}</p>

    <!-- courses label only on full cards -->
    <div v-if="courses.length && variant === 'light'" class="courses-label">Courses I Help With</div>

    <!-- course tags - show on both variants but styled differently -->
    <div v-if="courses.length" class="course-tags">
      <CourseTag
        v-for="course in courses"
        :key="course"
        :code="course"
        :variant="variant === 'dark' ? 'light' : 'default'"
        size="md"
      />
    </div>

    <!-- shows when the tutor is next available -->
    <div v-if="nextAvailable && variant === 'light'" class="schedule-preview">
      <div class="schedule-icon">
        <!-- calendar icon -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="schedule-text">
        <div class="schedule-label">Next Available</div>
        <div class="schedule-next">{{ nextAvailable }}</div>
      </div>
    </div>

    <!-- view profile button only on light variant -->
    <div v-if="variant === 'light'" class="tutor-card-footer">
      <button class="view-profile-btn">View Full Profile →</button>
    </div>
  </div>
</template>

<script>
import CourseTag from './CourseTag.vue'

export default {
  name: 'TutorCard',
  components: {
    CourseTag
  },
  props: {
    // tutor's display name
    name: {
      type: String,
      required: true
    },
    // two-letter initials for the avatar circle
    initials: {
      type: String,
      required: true
    },
    // tutor's scheduled time, like "9:00 AM – 12:00 PM"
    time: {
      type: String,
      default: ''
    },
    // array of course codes like ['CS 1400', 'CS 1410']
    courses: {
      type: Array,
      default: () => []
    },
    // use 'dark' for the home page on-duty section (navy background)
    // use 'light' for the tutors list page (white cards)
    variant: {
      type: String,
      default: 'dark',
      validator: (val) => ['dark', 'light'].includes(val)
    },
    // these are only used on the tutors list page (light variant)
    role: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    // whether the tutor is currently available
    available: {
      type: Boolean,
      default: false
    },
    nextAvailable: {
      type: String,
      default: ''
    },
    // cloudinary photo url - shows initials if empty
    photo: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.tutor-card {
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

/* dark cards for the navy "tutors on duty" section on home page */
.tutor-card.dark {
  background: var(--navy-light);
}

.tutor-card.dark:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
}

/* light cards for the tutors list page */
.tutor-card.light {
  background: var(--warm-white);
  border: 1px solid var(--gray-200);
}

.tutor-card.light:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.availability-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.tutor-card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.tutor-avatar {
  width: 48px;
  height: 48px;
  background: var(--utu-red);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}

/* bigger avatar on the full tutor cards */
.tutor-card.light .tutor-avatar {
  width: 56px;
  height: 56px;
  font-size: 18px;
}

.tutor-avatar-img {
  object-fit: cover;
}

.tutor-info {
  display: flex;
  flex-direction: column;
}

.tutor-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.tutor-card.dark h4 {
  color: white;
}

.tutor-card.light h4 {
  color: var(--navy);
  font-size: 18px;
}

.tutor-role {
  font-size: 13px;
  color: var(--gray-600);
  font-weight: 500;
}

.tutor-time {
  font-size: 13px;
  font-weight: 500;
}

.tutor-card.dark .tutor-time {
  color: var(--accent-gold);
}

.tutor-card.light .tutor-time {
  color: var(--utu-red);
}

.tutor-bio {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 16px;
}

.courses-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.schedule-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.schedule-icon {
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--utu-red);
  flex-shrink: 0;
}

.schedule-label {
  font-size: 12px;
  color: var(--gray-400);
  margin-bottom: 2px;
}

.schedule-next {
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
}

.tutor-card-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.view-profile-btn {
  width: 100%;
  padding: 14px;
  background: var(--gray-100);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.view-profile-btn:hover {
  background: var(--utu-red);
  color: white;
}
</style>