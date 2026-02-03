<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="logo-text">Tutoring Center</div>
        <p>Free walk-in tutoring for Utah Tech University Department of Computing students.</p>
      </div>
      
      <div class="footer-links">
        <div class="footer-column">
          <h4>Quick Links</h4>
          <router-link to="/">Home</router-link>
          <router-link to="/schedule">Schedule</router-link>
          <router-link to="/tutors">Tutors</router-link>
          <router-link to="/courses">Courses</router-link>
        </div>
        
        <div class="footer-column">
          <h4>For Tutors</h4>
          <router-link to="/login">Login</router-link>
          <a href="#">Dashboard</a>
          <a href="#">Manage Schedule</a>
        </div>
        
        <div class="footer-column">
          <h4>Contact</h4>
          <a href="#">Department of Computing</a>
          <a href="#">Utah Tech University</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      © 2025 Utah Tech University Department of Computing. All rights reserved.
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
/* main footer container */
.footer {
  background: var(--navy);
  color: white;
  padding: 40px 48px 24px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* left side branding */
.footer-brand {
  max-width: 320px;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-brand p {
  color: var(--gray-400);
  font-size: 15px;
  line-height: 1.6;
}

/* right side links */
.footer-links {
  display: flex;
  gap: 60px;
}

.footer-column h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  color: var(--gray-400);
}

.footer-column a {
  display: block;
  color: white;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 12px;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: var(--accent-gold);
}

/* bottom copyright section */
.footer-bottom {
  max-width: 1200px;
  margin: 32px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: var(--gray-400);
  font-size: 14px;
}

/* mobile responsive */
@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    gap: 40px;
  }
  
  .footer-links {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 24px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 32px;
  }
}
</style>