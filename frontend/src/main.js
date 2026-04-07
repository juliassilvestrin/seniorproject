// main entry point for the vue app
// imports global styles, creates the app, and mounts it to the dom

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// register vue router for page navigation
app.use(router)

// mount the app to the #app div in index.html
app.mount('#app')
