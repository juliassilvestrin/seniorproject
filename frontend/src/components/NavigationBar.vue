<template>
  <nav class="navbar">
    <router-link to="/" class="logo">
      <div class="logo-icon">TC</div>
      <span class="logo-text">Tutoring Center</span>
    </router-link>
    
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/schedule" class="nav-link">Schedule</router-link>
      <router-link to="/tutors" class="nav-link">Tutors</router-link>
      <router-link to="/courses" class="nav-link">Courses</router-link>
    </div>
    
    <router-link to="/login" class="nav-cta">Tutor Login</router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<style scoped>
/* fixed nav bar that stays at the top when scrolling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--gray-200);
  padding: 0 48px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* logo section on the left */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--utu-red);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.logo-text {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 600; 
  color: var(--navy);
}


/* main navigation links in the center */
.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 10px 20px;
  text-decoration: none;
  color: var(--gray-600);
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--gray-100);
  color: var(--navy);
}

/* active link styling */
.nav-link.router-link-active {
  background: var(--navy);
  color: white;
}

/* tutor login button on the right */
.nav-cta {
  background: var(--utu-red);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
}

.nav-cta:hover {
  background: var(--utu-red-dark);
  transform: translateY(-1px);
}

/* mobile view, hide nav links on small screens */
@media (max-width: 768px) {
  .navbar {
    padding: 0 24px;
  }
  
  .nav-links {
    display: none;
  }
}
</style>