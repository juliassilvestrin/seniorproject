<template>
  <main class="register-page">
    <div class="register-wrapper">

      <!-- left side: registration form -->
      <div class="register-form-section">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Enter your invite code to register as a tutor</p>
        </div>

        <!-- error banner - shows api or validation errors -->
        <div v-if="errorMessage" class="error-banner">
          <div class="error-banner-icon">!</div>
          <span class="error-banner-text">{{ errorMessage }}</span>
        </div>

        <!-- success state - shown after registration completes -->
        <div v-if="registered" class="success-section">
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Account Created!</h2>
          <p>Your tutor account has been set up successfully. You can now sign in to access your dashboard.</p>
          <router-link to="/login" class="login-link-btn">
            Go to Sign In
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <!-- registration form - two step wizard -->
        <form v-else class="register-form" @submit.prevent="handleRegister">

          <!-- step 1: invite code verification -->
          <div v-if="step === 1" class="form-step">
            <div class="form-group">
              <label class="form-label" for="inviteCode">Invite Code</label>
              <input
                type="text"
                id="inviteCode"
                class="form-input code-input"
                :class="{ error: errors.inviteCode }"
                v-model="inviteCode"
                placeholder="e.g., UTU-2026-ALPHA"
                autocomplete="off"
                @input="errors.inviteCode = ''"
              >
              <span v-if="errors.inviteCode" class="form-error">{{ errors.inviteCode }}</span>
              <span class="form-hint">Enter the invite code provided by your administrator</span>
            </div>

            <button type="button" class="register-btn" @click="verifyCode" :disabled="isLoading">
              {{ isLoading ? 'Verifying...' : 'Verify Code' }}
            </button>
          </div>

          <!-- step 2: personal info and password -->
          <div v-if="step === 2" class="form-step">
            <!-- badge showing code was verified -->
            <div class="step-indicator">
              <div class="step-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Code verified
              </div>
            </div>

            <!-- first and last name side by side -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  class="form-input"
                  :class="{ error: errors.firstName }"
                  v-model="firstName"
                  placeholder="Jane"
                  @input="errors.firstName = ''"
                >
                <span v-if="errors.firstName" class="form-error">{{ errors.firstName }}</span>
              </div>
              <div class="form-group">
                <label class="form-label" for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  class="form-input"
                  :class="{ error: errors.lastName }"
                  v-model="lastName"
                  placeholder="Doe"
                  @input="errors.lastName = ''"
                >
                <span v-if="errors.lastName" class="form-error">{{ errors.lastName }}</span>
              </div>
            </div>

            <!-- email field -->
            <div class="form-group">
              <label class="form-label" for="regEmail">Email Address</label>
              <input
                type="email"
                id="regEmail"
                class="form-input"
                :class="{ error: errors.email }"
                v-model="email"
                placeholder="you@utahtech.edu"
                autocomplete="email"
                @input="errors.email = ''"
              >
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>

            <!-- password with show/hide toggle -->
            <div class="form-group">
              <label class="form-label" for="regPassword">Password</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="regPassword"
                  class="form-input"
                  :class="{ error: errors.password }"
                  v-model="password"
                  placeholder="At least 8 characters"
                  autocomplete="new-password"
                  @input="errors.password = ''"
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </div>

            <!-- confirm password field -->
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                class="form-input"
                :class="{ error: errors.confirmPassword }"
                v-model="confirmPassword"
                placeholder="Re-enter your password"
                autocomplete="new-password"
                @input="errors.confirmPassword = ''"
              >
              <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
            </div>

            <!-- back + submit buttons -->
            <div class="form-actions-row">
              <button type="button" class="back-btn" @click="step = 1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <button type="submit" class="register-btn" :disabled="isLoading">
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </div>
          </div>

        </form>

        <!-- link to login if they already have an account -->
        <div v-if="!registered" class="login-link">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </div>

      <!-- right side: info panel with step progress -->
      <div class="register-info-section">
        <div class="info-content">
          <!-- lock icon -->
          <div class="info-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2>Join the Team</h2>
          <p>Use your invite code to create a tutor account. Once registered, you'll be able to set up your schedule and start helping students.</p>

          <!-- progress steps - highlights based on current step -->
          <div class="info-steps">
            <div class="info-step" :class="{ active: step >= 1, done: step > 1 }">
              <div class="step-number">1</div>
              <div class="step-text">
                <h3>Enter Invite Code</h3>
                <p>Use the code from your admin</p>
              </div>
            </div>
            <div class="info-step" :class="{ active: step >= 2, done: registered }">
              <div class="step-number">2</div>
              <div class="step-text">
                <h3>Create Your Account</h3>
                <p>Fill in your details</p>
              </div>
            </div>
            <div class="info-step" :class="{ active: registered }">
              <div class="step-number">3</div>
              <div class="step-text">
                <h3>Start Tutoring</h3>
                <p>Set up your schedule</p>
              </div>
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
  name: 'RegisterView',

  data() {
    return {
      step: 1,                 // tracks which step of the wizard we're on
      registered: false,       // flips to true after successful registration
      isLoading: false,        // disables buttons while waiting
      showPassword: false,     // toggles password visibility
      errorMessage: '',        // general error shown in the banner

      // form fields
      inviteCode: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',

      // per-field validation errors
      errors: {
        inviteCode: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },

  methods: {
    // checks the invite code against the backend
    async verifyCode() {
      this.errors.inviteCode = ''
      this.errorMessage = ''

      if (!this.inviteCode.trim()) {
        this.errors.inviteCode = 'Please enter an invite code'
        return
      }

      this.isLoading = true

      try {
        await authService.verifyInviteCode(this.inviteCode.trim())
        this.step = 2
      } catch (err) {
        this.errors.inviteCode = err.response?.data?.message || 'Invalid or expired invite code'
      } finally {
        this.isLoading = false
      }
    },

    // validates all the fields in step 2
    validate() {
      this.errors = {
        inviteCode: '', firstName: '', lastName: '',
        email: '', password: '', confirmPassword: ''
      }
      let valid = true

      if (!this.firstName.trim()) {
        this.errors.firstName = 'First name is required'
        valid = false
      }

      if (!this.lastName.trim()) {
        this.errors.lastName = 'Last name is required'
        valid = false
      }

      // basic email check - just making sure there's an @
      if (!this.email) {
        this.errors.email = 'Email is required'
        valid = false
      } else if (!this.email.includes('@')) {
        this.errors.email = 'Please enter a valid email address'
        valid = false
      }

      // password needs to be at least 8 chars
      if (!this.password) {
        this.errors.password = 'Password is required'
        valid = false
      } else if (this.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters'
        valid = false
      }

      // make sure passwords match
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
        valid = false
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
        valid = false
      }

      return valid
    },

    // handles the final registration submit
    async handleRegister() {
      this.errorMessage = ''

      if (!this.validate()) return

      this.isLoading = true

      try {
        await authService.register({
          inviteCode: this.inviteCode.trim(),
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          email: this.email,
          password: this.password
        })
        this.registered = true
      } catch (err) {
        this.errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 48px 48px;
  background: var(--cream);
}

.register-wrapper {
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
.register-form-section {
  padding: 60px;
}

.register-header {
  margin-bottom: 40px;
}

.register-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 12px;
}

.register-header p {
  font-size: 16px;
  color: var(--gray-600);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.code-input {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 18px;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
}

.form-error {
  font-size: 13px;
  color: #DC2626;
}

.form-hint {
  font-size: 13px;
  color: var(--gray-400);
}

/* password */
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

/* step indicator */
.step-indicator {
  margin-bottom: 8px;
}

.step-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.1);
  color: #16A34A;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
}

/* buttons */
.register-btn {
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
}

.register-btn:hover:not(:disabled) {
  background: var(--utu-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(186, 28, 33, 0.3);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-actions-row {
  display: flex;
  gap: 12px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 18px 24px;
  background: var(--warm-white);
  color: var(--navy);
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}

.form-actions-row .register-btn {
  flex: 1;
}

/* login link */
.login-link {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: var(--gray-600);
}

.login-link a {
  color: var(--utu-red);
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

/* success state */
.success-section {
  text-align: center;
  padding: 32px 0;
}

.success-icon {
  color: #22C55E;
  margin-bottom: 24px;
}

.success-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 12px;
}

.success-section p {
  font-size: 16px;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 32px;
}

.login-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: var(--utu-red);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.login-link-btn:hover {
  background: var(--utu-red-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(186, 28, 33, 0.3);
}

/* info section */
.register-info-section {
  background: linear-gradient(135deg, var(--navy) 0%, #001a33 100%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.register-info-section::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(186, 28, 33, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.info-content {
  position: relative;
}

.info-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
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

.info-content > p {
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.7;
  margin-bottom: 40px;
}

/* steps indicator */
.info-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-step {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.info-step.active {
  opacity: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.info-step.active .step-number {
  border-color: var(--utu-red);
  background: var(--utu-red);
}

.info-step.done .step-number {
  border-color: #22C55E;
  background: #22C55E;
}

.step-text h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.step-text p {
  font-size: 13px;
  opacity: 0.7;
}

/* responsive */
@media (max-width: 900px) {
  .register-page {
    padding: 100px 24px 24px;
  }

  .register-wrapper {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .register-info-section {
    display: none;
  }

  .register-form-section {
    padding: 40px;
  }
}

@media (max-width: 500px) {
  .register-form-section {
    padding: 32px 24px;
  }

  .register-header h1 {
    font-size: 28px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions-row {
    flex-direction: column;
  }
}
</style>
