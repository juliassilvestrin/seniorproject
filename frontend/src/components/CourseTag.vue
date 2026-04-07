<template>
  <!-- small pill/badge that displays a course code -->
  <span class="course-tag" :class="[variant, size]">
    {{ code }}
  </span>
</template>

<script>
export default {
  name: 'CourseTag',
  props: {
    // the course code to display, like "CS 1400"
    code: {
      type: String,
      required: true
    },
    // use 'light' on dark backgrounds, 'default' on light backgrounds
    variant: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'light'].includes(val)
    },
    // 'sm' for schedule slots, 'md' for tutor cards
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['sm', 'md'].includes(val)
    }
  }
}
</script>

<style scoped>
.course-tag {
  display: inline-block;
  font-weight: 600;
  border-radius: 6px;
}

.course-tag.md {
  padding: 5px 10px;
  font-size: 12px;
}

.course-tag.sm {
  padding: 3px 8px;
  font-size: 11px;
}

.course-tag.default {
  background: var(--gray-100);
  color: var(--navy);
}

.course-tag.light {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
</style>