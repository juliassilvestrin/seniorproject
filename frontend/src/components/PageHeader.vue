<template>
  <!-- reusable page header banner with title and optional description -->
  <div class="page-header">
    <div class="page-header-content">
      <h1>{{ title }}</h1>
      <!-- only show description if one was passed in -->
      <p v-if="description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    // page title, always required
    title: {
      type: String,
      required: true
    },
    // optional subtitle text below the title
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.page-header {
  background: var(--warm-white);
  border-bottom: 1px solid var(--gray-200);
  padding: 24px 48px;
  padding-top: 96px;
}

.page-header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: var(--gray-600);
  max-width: 560px;
}

/* mobile */
@media (max-width: 768px) {
  .page-header {
    padding: 88px 24px 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 14px;
  }
}
</style>