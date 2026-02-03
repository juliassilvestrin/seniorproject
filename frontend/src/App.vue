<template>
  <div id="app">
    <NavigationBar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
    Footer
  }
}
</script>

<style>
/* router view needs top padding so content doesn't hide under the fixed nav */
#app {
  min-height: 100vh;
}

/* add space at top for the fixed navbar (72px tall) */
main {
  padding-top: 72px;
}
</style>