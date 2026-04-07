<template>
  <!-- reusable search input with magnifying glass icon -->
  <div class="search-box">
    <!-- magnifying glass svg icon -->
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
    <!-- v-model compatible input, emits updates to parent -->
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    // supports v-model binding from the parent
    modelValue: {
      type: String,
      default: ''
    },
    // customizable placeholder text
    placeholder: {
      type: String,
      default: 'Search...'
    }
  },
  // needed for v-model to work in vue 3
  emits: ['update:modelValue']
}
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  padding: 10px 16px;
  width: 400px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--utu-red);
  background: var(--warm-white);
}

.search-box svg {
  color: var(--gray-400);
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: var(--navy);
  width: 100%;
  outline: none;
}

.search-box input::placeholder {
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .search-box {
    width: 100%;
  }
}
</style>