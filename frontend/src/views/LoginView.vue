<template>
  <main class="login-page">
    <div class="login-wrapper">

      <!-- left side: login form -->
      <div class="login-form-section">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to manage your schedule and profile</p>
        </div>

        <!-- error banner - shows when login fails -->
        <div v-if="errorMessage" class="error-banner">
          <div class="error-banner-icon">!</div>
          <span class="error-banner-text">{{ errorMessage }}</span>
        </div>

        <!-- login form - prevents default submit so we handle it ourselves -->
        <form class="login-form" @submit.prevent="handleLogin">
          <!-- email input -->
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              class="form-input"
              :class="{ error: errors.email }"
              v-model="email"
              placeholder="you@utahtech.edu"
              autocomplete="email"
              @input="errors.email = ''"
            >
            <!-- inline validation message -->
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <!-- password input with show/hide toggle -->
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-input"
                :class="{ error: errors.password }"
                v-model="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                @input="errors.password = ''"
              >
              <!-- eye icon toggles password visibility -->
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <!-- open eye svg -->
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- closed eye svg (password hidden) -->
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <!-- remember me + forgot password row -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe">
              <span>Remember me</span>
            </label>
            <!-- todo: hook up forgot password flow -->
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <!-- submit button - disabled while loading -->
          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- link to registration for new tutors -->
        <div class="register-link">
          New tutor? <router-link to="/register">Create an account</router-link>
        </div>
      </div>

      <!-- right side: info panel with feature highlights -->
      <div class="login-info-section">
        <div class="info-content">
          <!-- user icon -->
          <div class="info-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2>Tutor Portal</h2>
          <p>Access your personalized dashboard to manage your tutoring schedule, update your profile, and communicate absences.</p>

          <!-- feature list - highlights what tutors can do -->
          <div class="info-features">
            <div class="info-feature">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span class="feature-text">Manage your weekly schedule</span>
            </div>
            <div class="info-feature">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <span class="feature-text">Update your bio and courses</span>
            </div>
            <div class="info-feature">
              <div class="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <span class="feature-text">Mark absences in advance</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import { authService } from '@/services/auth'

export default {
  name: 'LoginView',

  data() {
    return {
      // form fields
      email: '',
      password: '',
      showPassword: false,       // toggles password visibility
      rememberMe: false,         // todo: persist login state with this
      isLoading: false,          // shows spinner on the button
      errorMessage: '',          // general error shown in the banner
      errors: {                  // per-field validation errors
        email: '',
        password: ''
      }
    }
  },

  methods: {
    // checks email and password fields before submitting
    validate() {
      this.errors = { email: '', password: '' }
      let valid = true

      // make sure email is present and has an @ sign
      if (!this.email) {
        this.errors.email = 'Please enter your email address'
        valid = false
      } else if (!this.email.includes('@')) {
        this.errors.email = 'Please enter a valid email address'
        valid = false
      }

      if (!this.password) {
        this.errors.password = 'Password is required'
        valid = false
      }

      return valid
    },

    // handles the login form submission
    async handleLogin() {
      this.errorMessage = ''

      if (!this.validate()) return

      this.isLoading = true

      try {
        await authService.login(this.email, this.password)
        this.$router.push('/dashboard')
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Invalid email or password. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 48px 48px;
  background: var(--cream);
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--warm-white);
  border-radius: 32px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* form section */
.login-form-section {
  padding: 60px;
}

.login-header {
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 12px;
}

.login-header p {
  font-size: 16px;
  color: var(--gray-600);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
}

.form-input {
  padding: 16px 20px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  background: var(--warm-white);
  color: var(--navy);
}

.form-input:focus {
  outline: none;
  border-color: var(--utu-red);
  box-shadow: 0 0 0 4px rgba(186, 28, 33, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
}

.form-input.error {
  border-color: #DC2626;
}

.form-error {
  font-size: 13px;
  color: #DC2626;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .form-input {
  width: 100%;
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.password-toggle:hover {
  color: var(--navy);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.remember-me input {
  width: 20px;
  height: 20px;
  accent-color: var(--utu-red);
  cursor: pointer;
}

.remember-me span {
  font-size: 14px;
  color: var(--gray-600);
}

.forgot-link {
  font-size: 14px;
  color: var(--utu-red);
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 18px;
  background: var(--utu-red);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: var(--utu-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(186, 28, 33, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* error banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
}

.error-banner-icon {
  width: 24px;
  height: 24px;
  background: #DC2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.error-banner-text {
  font-size: 14px;
  color: #DC2626;
}

/* info section */
.login-info-section {
  background: linear-gradient(135deg, var(--utu-red) 0%, var(--utu-red-dark) 100%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.login-info-section::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.info-content {
  position: relative;
}

.info-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.info-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.info-content p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 32px;
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-feature {
  display: flex;
  align-items: center;
  gap: 14px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-text {
  font-size: 15px;
  font-weight: 500;
}

.register-link {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: var(--gray-600);
}

.register-link a {
  color: var(--utu-red);
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* responsive */
@media (max-width: 900px) {
  .login-page {
    padding: 100px 24px 24px;
  }

  .login-wrapper {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .login-info-section {
    display: none;
  }

  .login-form-section {
    padding: 40px;
  }
}

@media (max-width: 500px) {
  .login-form-section {
    padding: 32px 24px;
  }

  .login-header h1 {
    font-size: 28px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
