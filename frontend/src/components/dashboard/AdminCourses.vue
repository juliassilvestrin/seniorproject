<template>
  <!-- admin panel for managing courses -->
  <div class="admin-courses">
    <div class="section-header">
      <div>
        <h2>Manage Courses</h2>
        <p>Add, edit, or remove courses that tutors can be assigned to</p>
      </div>
      <!-- opens the add course form -->
      <button class="btn btn-primary" @click="showAddForm = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Course
      </button>
    </div>

    <!-- add course form - toggleable -->
    <div v-if="showAddForm" class="card" style="margin-bottom: 24px">
      <div class="card-header">
        <h3>Add New Course</h3>
        <button class="close-btn" @click="showAddForm = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <form class="course-form" @submit.prevent="addCourse">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Course Code</label>
              <input type="text" v-model="newCourse.code" class="form-input" placeholder="e.g., CS 1400">
            </div>
            <div class="form-group">
              <label class="form-label">Course Name</label>
              <input type="text" v-model="newCourse.name" class="form-input" placeholder="e.g., Fundamentals of Programming">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showAddForm = false">Cancel</button>
            <!-- disabled until both fields are filled -->
            <button type="submit" class="btn btn-primary" :disabled="!newCourse.code || !newCourse.name">Add Course</button>
          </div>
        </form>
      </div>
    </div>

    <!-- courses list -->
    <div class="card">
      <div class="card-header">
        <h3>All Courses ({{ courses.length }})</h3>
      </div>
      <div class="card-body">
        <div class="courses-grid">
          <div v-for="(course, index) in courses" :key="course.code" class="course-card">
            <!-- course code badge on the left -->
            <div class="course-code-badge">{{ course.code }}</div>
            <!-- course name and tutor count -->
            <div class="course-details">
              <div class="course-name">{{ course.name }}</div>
              <div class="course-tutors">{{ course.tutorCount }} {{ course.tutorCount === 1 ? 'tutor' : 'tutors' }} assigned</div>
            </div>
            <!-- edit and delete actions -->
            <div class="course-actions">
              <!-- todo: implement edit course modal -->
              <button class="icon-btn" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <!-- todo: add confirmation before deleting -->
              <button class="icon-btn delete" title="Remove" @click="removeCourse(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminService } from '@/services/admin'

export default {
  name: 'AdminCourses',

  data() {
    return {
      showAddForm: false,
      newCourse: { code: '', name: '' },
      courses: []
    }
  },

  async created() {
    await this.loadCourses()
  },

  methods: {
    async loadCourses() {
      try {
        this.courses = await adminService.getAllCourses()
      } catch (err) {
        console.error('failed to load courses:', err)
      }
    },

    // add new course via api
    async addCourse() {
      if (!this.newCourse.code || !this.newCourse.name) return
      try {
        const course = await adminService.addCourse(this.newCourse)
        this.courses.push(course)
        this.newCourse = { code: '', name: '' }
        this.showAddForm = false
      } catch (err) {
        console.error('failed to add course:', err)
      }
    },

    // remove a course via api
    async removeCourse(index) {
      const course = this.courses[index]
      if (!course) return
      try {
        await adminService.deleteCourse(course.id)
        this.courses.splice(index, 1)
      } catch (err) {
        console.error('failed to remove course:', err)
      }
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
}
.section-header h2 { font-size: 24px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.section-header p { font-size: 15px; color: var(--gray-600); }

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
  cursor: pointer; transition: all 0.2s ease; border: none;
}
.btn-primary { background: var(--utu-red); color: white; }
.btn-primary:hover { background: var(--utu-red-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: var(--warm-white); color: var(--navy); border: 1px solid var(--gray-200); }
.btn-secondary:hover { background: var(--gray-100); }

.card {
  background: var(--warm-white); border-radius: 20px;
  border: 1px solid var(--gray-200); overflow: hidden;
}
.card-header {
  padding: 20px 24px; border-bottom: 1px solid var(--gray-200);
  display: flex; justify-content: space-between; align-items: center;
}
.card-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); }
.card-body { padding: 24px; }

.close-btn { background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 4px; }
.close-btn:hover { color: var(--navy); }

/* form */
.course-form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-size: 14px; font-weight: 600; color: var(--navy); }
.form-input {
  padding: 12px 16px; border: 2px solid var(--gray-200); border-radius: 10px;
  font-size: 15px; font-family: 'Inter', sans-serif; color: var(--navy); transition: all 0.2s ease;
}
.form-input:focus { outline: none; border-color: var(--utu-red); box-shadow: 0 0 0 3px rgba(186, 28, 33, 0.1); }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; }

/* courses grid */
.courses-grid { display: flex; flex-direction: column; gap: 12px; }

.course-card {
  display: flex; align-items: center; gap: 16px;
  padding: 16px; background: var(--gray-100); border-radius: 12px;
  transition: all 0.2s ease;
}
.course-card:hover { background: var(--gray-200); }

.course-code-badge {
  background: var(--navy); color: white;
  padding: 8px 14px; border-radius: 8px;
  font-size: 14px; font-weight: 700; white-space: nowrap;
}

.course-details { flex: 1; }
.course-name { font-size: 15px; font-weight: 600; color: var(--navy); margin-bottom: 2px; }
.course-tutors { font-size: 13px; color: var(--gray-400); }

.course-actions { display: flex; gap: 8px; }
.icon-btn {
  width: 36px; height: 36px;
  border: 1px solid var(--gray-200); background: var(--warm-white);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--gray-600); transition: all 0.2s ease;
}
.icon-btn:hover { border-color: var(--gray-400); color: var(--navy); }
.icon-btn.delete:hover { border-color: #DC2626; color: #DC2626; background: rgba(220, 38, 38, 0.05); }

@media (max-width: 768px) {
  .section-header { flex-direction: column; gap: 16px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>