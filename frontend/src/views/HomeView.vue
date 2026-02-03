<template>
  <main class="home">
    <!-- hero section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <!-- badge at the top -->
          <div class="hero-badge">
            <span>Free Walk-in Tutoring</span>
          </div>
          
          <!-- main heading with red highlight -->
          <h1>Get Help with Your <span class="highlight">CS Courses</span></h1>
          
          <!-- description -->
          <p>Connect with experienced tutors at Utah Tech University's Department of Computing. Walk-in help available in Smith Building — look for the red vests.</p>
          
          <!-- action buttons -->
          <div class="hero-buttons">
            <router-link to="/schedule" class="btn-primary">
              View Schedule
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <router-link to="/tutors" class="btn-secondary">
              Meet Our Tutors
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* hero section */
.hero {
  padding: 160px 48px 100px;
  background: linear-gradient(180deg, var(--warm-white) 0%, var(--cream) 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-text {
  max-width: 600px;
}

/* badge at top */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(186, 28, 33, 0.08);
  color: var(--utu-red);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

.hero-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--utu-red);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* main heading */
.hero h1 {
  font-size: 64px;
  line-height: 1.1;
  color: var(--navy);
  margin-bottom: 24px;
  font-weight: 700;
}

.hero h1 .highlight {
  color: var(--utu-red);
}

/* description text */
.hero p {
  font-size: 20px;
  color: var(--gray-600);
  margin-bottom: 40px;
  line-height: 1.6;
}

/* buttons */
.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--utu-red);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(186, 28, 33, 0.3);
}

.btn-primary:hover {
  background: var(--utu-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(186, 28, 33, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--warm-white);
  color: var(--navy);
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}


@media (max-width: 768px) {
  .hero {
    padding: 120px 24px 60px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
  }
}
</style>