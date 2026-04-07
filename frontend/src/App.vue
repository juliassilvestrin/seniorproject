<!--
  root app component
  conditionally shows/hides the navbar and footer based on the current route
  pages like the tv display and dashboard set hideChrome: true in their route meta
  so they get a full-screen layout without nav/footer
-->
<template>
  <div id="app">
    <!-- only show nav and footer on public pages (not dashboard or tv display) -->
    <NavigationBar v-if="!hideChrome" />
    <router-view />
    <SiteFooter v-if="!hideChrome" />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import SiteFooter from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
    SiteFooter
  },
  computed: {
    // checks route meta to decide if we should hide the nav/footer
    // used by dashboard and tv display routes
    hideChrome() {
      return this.$route.meta.hideChrome === true
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>