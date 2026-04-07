<template>
  <div class="profile-section">
    <!-- section header with link to public profile -->
    <div class="section-header">
      <div>
        <h2>Edit Profile</h2>
        <p>Update your public profile information</p>
      </div>
      <!-- opens tutor's public profile in a new tab -->
      <router-link :to="'/tutors/' + profileSlug" class="btn btn-secondary" target="_blank">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        View Public Profile
      </router-link>
    </div>

    <div class="profile-grid">
      <!-- left: main profile form -->
      <div class="card">
        <div class="card-header">
          <h3>Personal Information</h3>
        </div>
        <div class="card-body">
          <form class="profile-form" @submit.prevent="saveProfile">
            <!-- name fields side by side -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" v-model="form.firstName" class="form-input" placeholder="Jane">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" v-model="form.lastName" class="form-input" placeholder="Doe">
              </div>
            </div>

            <!-- email is disabled - only admins can change it -->
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" v-model="form.email" class="form-input" placeholder="you@utahtech.edu" disabled>
              <span class="form-hint">Contact an admin to change your email</span>
            </div>

            <!-- bio textarea with character count -->
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea v-model="form.bio" class="form-input form-textarea" rows="5" placeholder="Tell students about yourself, your experience, and how you can help..."></textarea>
              <span class="form-hint">{{ form.bio.length }} / 500 characters</span>
            </div>

            <div class="form-group">
              <label class="form-label">Specialization</label>
              <input type="text" v-model="form.specialization" class="form-input" placeholder="e.g., OOP & Data Structures">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="resetForm">Discard Changes</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <!-- right: avatar + courses sidebar -->
      <div class="right-column">
        <!-- avatar card -->
        <div class="card">
          <div class="card-header">
            <h3>Profile Photo</h3>
          </div>
          <div class="card-body avatar-section">
            <div class="avatar-preview">
              <!-- show photo if available, otherwise initials -->
              <img v-if="form.photo" :src="form.photo" class="avatar-img" alt="Profile photo">
              <div v-else class="avatar-circle">{{ initials }}</div>
            </div>
            <!-- hidden file input triggered by the button -->
            <input
              type="file"
              ref="photoInput"
              accept="image/*"
              style="display:none"
              @change="handlePhotoUpload"
            >
            <button class="btn btn-secondary btn-sm" @click="$refs.photoInput.click()" :disabled="uploadingPhoto">
              {{ uploadingPhoto ? 'Uploading...' : 'Upload Photo' }}
            </button>
            <p class="avatar-hint">JPG or PNG, max 5MB. Square photos work best.</p>
          </div>
        </div>

        <!-- courses card - add/remove courses you tutor for -->
        <div class="card">
          <div class="card-header">
            <h3>My Courses</h3>
          </div>
          <div class="card-body">
            <!-- list of currently assigned courses -->
            <div class="courses-list">
              <div
                v-for="course in form.courses"
                :key="course"
                class="course-item"
              >
                <span class="course-code">{{ course }}</span>
                <button class="remove-btn" @click="removeCourse(course)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- dropdown to add a new course -->
            <div class="add-course">
              <!-- only shows courses not already assigned -->
              <select v-model="newCourse" class="form-input form-input-sm">
                <option value="">Add a course...</option>
                <option
                  v-for="course in availableCourses"
                  :key="course"
                  :value="course"
                >{{ course }}</option>
              </select>
              <button
                class="btn btn-primary btn-sm"
                :disabled="!newCourse"
                @click="addCourse"
              >Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- success toast notification - shows after saving -->
    <div v-if="showSuccess" class="success-toast">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      Profile saved successfully!
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardProfile',

  props: {
    // user object from parent - used to pre-fill the form
    user: { type: Object, required: true }
  },

  data() {
    return {
      newCourse: '',
      showSuccess: false,
      uploadingPhoto: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        specialization: '',
        courses: [],
        photo: ''
      },
      allCourses: []  // loaded from api on mount
    }
  },

  computed: {
    // generate initials from first and last name
    initials() {
      return this.form.firstName.charAt(0) + this.form.lastName.charAt(0)
    },

    // create url slug from the tutor's name
    profileSlug() {
      return (this.form.firstName + '-' + this.form.lastName).toLowerCase()
    },

    // filter out courses already assigned to this tutor
    availableCourses() {
      return this.allCourses.filter(c => !this.form.courses.includes(c))
    }
  },

  async created() {
    this.loadProfile()
    await this.loadCourses()
  },

  methods: {
    // fetch available courses from the backend
    async loadCourses() {
      try {
        const { courseService } = await import('@/services/courses')
        const data = await courseService.getAll()
        this.allCourses = data.map(c => c.code)
      } catch (err) {
        console.error('failed to load courses:', err)
      }
    },

    // pre-fill the form with data from the user prop
    loadProfile() {
      const names = this.user.name.split(' ')
      this.form.firstName = names[0] || ''
      this.form.lastName = names.slice(1).join(' ') || ''
      this.form.email = this.user.email || ''
      this.form.bio = this.user.bio || ''
      this.form.specialization = this.user.specialization || ''
      this.form.courses = [...(this.user.courses || [])]
      this.form.photo = this.user.photo || ''
    },

    // discard changes and reload from user prop
    resetForm() {
      this.loadProfile()
    },

    // save profile changes to the backend
    async saveProfile() {
      try {
        const { tutorService } = await import('@/services/tutors')
        await tutorService.updateProfile({
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          bio: this.form.bio,
          specialization: this.form.specialization,
          courses: this.form.courses
        })
        this.showSuccess = true
        setTimeout(() => { this.showSuccess = false }, 3000)
      } catch (err) {
        console.error('failed to save profile:', err)
      }
    },

    // handle photo file selection and upload to cloudinary via backend
    async handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      this.uploadingPhoto = true
      try {
        const { uploadService } = await import('@/services/upload')
        const result = await uploadService.uploadAvatar(file)
        this.form.photo = result.photo
        this.showSuccess = true
        setTimeout(() => { this.showSuccess = false }, 3000)
      } catch (err) {
        console.error('failed to upload photo:', err)
      } finally {
        this.uploadingPhoto = false
      }
    },

    // add a course to the tutor's list
    addCourse() {
      if (this.newCourse && !this.form.courses.includes(this.newCourse)) {
        this.form.courses.push(this.newCourse)
        this.newCourse = ''
      }
    },

    // remove a course from the tutor's list
    removeCourse(course) {
      this.form.courses = this.form.courses.filter(c => c !== course)
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-header h2 { font-size: 24px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.section-header p { font-size: 15px; color: var(--gray-600); }

.profile-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* buttons */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
  cursor: pointer; transition: all 0.2s ease;
  text-decoration: none; border: none;
}
.btn-primary { background: var(--utu-red); color: white; }
.btn-primary:hover { background: var(--utu-red-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: var(--warm-white); color: var(--navy); border: 1px solid var(--gray-200); }
.btn-secondary:hover { background: var(--gray-100); }
.btn-sm { padding: 8px 16px; font-size: 14px; }

/* cards */
.card {
  background: var(--warm-white);
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.card-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); }
.card-body { padding: 24px; }

/* form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  color: var(--navy);
}

.form-input:focus {
  outline: none;
  border-color: var(--utu-red);
  box-shadow: 0 0 0 3px rgba(186, 28, 33, 0.1);
}

.form-input:disabled {
  background: var(--gray-100);
  color: var(--gray-400);
  cursor: not-allowed;
}

.form-input-sm { padding: 8px 12px; font-size: 14px; }

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.form-hint {
  font-size: 12px;
  color: var(--gray-400);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

/* avatar */
.avatar-section { text-align: center; }

.avatar-preview { margin-bottom: 16px; }

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
  display: block;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--utu-red-light) 0%, var(--utu-red) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 auto;
}

.avatar-hint {
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.5;
}

/* courses */
.courses-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--gray-100);
  border-radius: 8px;
}

.course-code {
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 2px;
  display: flex;
}

.remove-btn:hover { color: #DC2626; }

.add-course {
  display: flex;
  gap: 8px;
}

.add-course .form-input { flex: 1; }

/* success toast */
.success-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: #22C55E;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
  z-index: 100;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* responsive */
@media (max-width: 1024px) {
  .profile-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .section-header { flex-direction: column; gap: 16px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>