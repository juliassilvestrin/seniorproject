<template>
  <!-- admin panel for managing all tutors -->
  <div class="admin-tutors">
    <div class="section-header">
      <div>
        <h2>Manage Tutors</h2>
        <p>View and manage all tutors in the system</p>
      </div>
      <!-- shortcut to the invite codes page -->
      <button class="btn btn-primary" @click="$emit('navigate', 'admin-invites')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Invite New Tutor
      </button>
    </div>

    <!-- tutors table card -->
    <div class="card">
      <div class="card-header">
        <h3>All Tutors ({{ tutors.length }})</h3>
        <!-- inline search to filter tutors by name or email -->
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Search tutors..." autocomplete="off">
        </div>
      </div>
      <div class="card-body no-padding">
        <table class="tutors-table">
          <thead>
            <tr>
              <th>Tutor</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- loop through filtered tutors -->
            <tr v-for="tutor in filteredTutors" :key="tutor.id">
              <!-- tutor name and email cell -->
              <td>
                <div class="tutor-cell">
                  <div class="tutor-avatar">{{ tutor.initials }}</div>
                  <div>
                    <div class="tutor-name">{{ tutor.name }}</div>
                    <div class="tutor-email">{{ tutor.email }}</div>
                  </div>
                </div>
              </td>
              <!-- role badge - senior tutors get a special gold style -->
              <td>
                <span class="role-badge" :class="{ senior: tutor.role === 'Senior Tutor' }">
                  {{ tutor.role }}
                </span>
              </td>
              <!-- course tags -->
              <td>
                <div class="course-tags">
                  <span v-for="course in tutor.courses" :key="course" class="course-tag">{{ course }}</span>
                </div>
              </td>
              <!-- active/inactive status -->
              <td>
                <span class="status-badge" :class="tutor.isActive ? 'active' : 'inactive'">
                  {{ tutor.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <!-- action buttons -->
              <td>
                <div class="action-btns">
                  <!-- role change dropdown -->
                  <select class="role-select" :value="tutor.role" @change="changeRole(tutor, $event.target.value)">
                    <option value="Tutor">Tutor</option>
                    <option value="Senior Tutor">Senior Tutor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <!-- toggle active/inactive -->
                  <button class="icon-btn" :title="tutor.isActive ? 'Deactivate' : 'Activate'" @click="toggleActive(tutor)">
                    <svg v-if="tutor.isActive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18.36 6.64A9 9 0 0 1 20.77 15"/>
                      <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/>
                      <line x1="2" y1="2" x2="22" y2="22"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </button>
                  <!-- reset password button - opens inline form for this tutor -->
                  <button class="icon-btn" title="Reset Password" @click="startReset(tutor.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </button>
                </div>
                <!-- inline password reset form - only shows for the tutor being reset -->
                <div v-if="resetingId === tutor.id" class="reset-form">
                  <input
                    type="password"
                    v-model="newPassword"
                    placeholder="New password"
                    class="reset-input"
                    autocomplete="new-password"
                  >
                  <div class="reset-actions">
                    <button class="reset-save-btn" @click="saveReset(tutor.id)" :disabled="!newPassword">Save</button>
                    <button class="reset-cancel-btn" @click="cancelReset">Cancel</button>
                  </div>
                  <span v-if="resetMsg" class="reset-msg">{{ resetMsg }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { adminService } from '@/services/admin'

export default {
  name: 'AdminTutors',

  emits: ['navigate'],

  data() {
    return {
      searchQuery: '',
      tutors: [],
      resetingId: null,   // which tutor's reset form is open
      newPassword: '',
      resetMsg: ''
    }
  },

  computed: {
    // filter tutors by name or email based on search query
    filteredTutors() {
      if (!this.searchQuery) return this.tutors
      const q = this.searchQuery.toLowerCase()
      return this.tutors.filter(t =>
        t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
      )
    }
  },

  async created() {
    await this.loadTutors()
  },

  methods: {
    async loadTutors() {
      try {
        this.tutors = await adminService.getAllTutors()
      } catch (err) {
        console.error('failed to load tutors:', err)
      }
    },

    // change a tutor's role via api
    async changeRole(tutor, role) {
      try {
        const updated = await adminService.changeTutorRole(tutor.id, role)
        tutor.role = updated.role
      } catch (err) {
        console.error('failed to change role:', err)
      }
    },

    // toggle a tutor's active status via api
    async toggleActive(tutor) {
      try {
        const updated = await adminService.toggleTutorActive(tutor.id)
        tutor.isActive = updated.isActive
      } catch (err) {
        console.error('failed to toggle tutor:', err)
      }
    },

    // open the reset form for a specific tutor
    startReset(id) {
      this.resetingId = id
      this.newPassword = ''
      this.resetMsg = ''
    },

    cancelReset() {
      this.resetingId = null
      this.newPassword = ''
      this.resetMsg = ''
    },

    // submit the new password to the api
    async saveReset(id) {
      if (!this.newPassword) return
      try {
        await adminService.resetTutorPassword(id, this.newPassword)
        this.resetMsg = 'password updated'
        setTimeout(() => this.cancelReset(), 1500)
      } catch (err) {
        this.resetMsg = 'failed to update password'
        console.error('failed to reset password:', err)
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
.no-padding { padding: 0; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--gray-100); padding: 8px 14px; border-radius: 8px;
  color: var(--gray-400);
}
.search-box input {
  border: none; background: none; font-size: 14px;
  font-family: 'Inter', sans-serif; color: var(--navy); outline: none; width: 180px;
}

/* table */
.tutors-table { width: 100%; border-collapse: collapse; }
.tutors-table th {
  text-align: left; padding: 14px 24px;
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--gray-400);
  border-bottom: 1px solid var(--gray-200); background: var(--gray-100);
}
.tutors-table td {
  padding: 16px 24px; border-bottom: 1px solid var(--gray-100);
  vertical-align: middle;
}
.tutors-table tr:last-child td { border-bottom: none; }
.tutors-table tr:hover td { background: var(--gray-100); }

.tutor-cell { display: flex; align-items: center; gap: 12px; }
.tutor-avatar {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--utu-red-light) 0%, var(--utu-red) 100%);
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 14px; flex-shrink: 0;
}
.tutor-name { font-size: 15px; font-weight: 600; color: var(--navy); }
.tutor-email { font-size: 13px; color: var(--gray-400); }

.role-badge {
  padding: 4px 10px; border-radius: 6px;
  font-size: 13px; font-weight: 600;
  background: var(--gray-100); color: var(--gray-600);
  white-space: nowrap;
}
.role-badge.senior { background: rgba(212, 168, 83, 0.15); color: #B8860B; }

.course-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.course-tag {
  background: var(--gray-100); padding: 3px 8px;
  border-radius: 4px; font-size: 12px; font-weight: 600; color: var(--navy);
}

.status-badge {
  padding: 4px 12px; border-radius: 100px;
  font-size: 13px; font-weight: 600;
}
.status-badge.active { background: rgba(34, 197, 94, 0.1); color: #16A34A; }
.status-badge.inactive { background: rgba(220, 38, 38, 0.1); color: #DC2626; }

.action-btns { display: flex; gap: 8px; align-items: center; }

.role-select {
  padding: 6px 10px; border: 1px solid var(--gray-200);
  border-radius: 8px; font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif; color: var(--navy);
  background: var(--warm-white); cursor: pointer;
}
.role-select:focus { outline: none; border-color: var(--utu-red); }
.icon-btn {
  width: 36px; height: 36px;
  border: 1px solid var(--gray-200); background: var(--warm-white);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--gray-600); transition: all 0.2s ease;
}
.icon-btn:hover { border-color: var(--gray-400); color: var(--navy); }

.reset-form {
  margin-top: 8px; display: flex; flex-direction: column; gap: 6px;
}
.reset-input {
  padding: 6px 10px; border: 1px solid var(--gray-200);
  border-radius: 8px; font-size: 13px; font-family: 'Inter', sans-serif;
  color: var(--navy); background: var(--warm-white); width: 100%;
}
.reset-input:focus { outline: none; border-color: var(--utu-red); }
.reset-actions { display: flex; gap: 6px; }
.reset-save-btn {
  padding: 5px 12px; background: var(--utu-red); color: white;
  border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer;
}
.reset-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.reset-cancel-btn {
  padding: 5px 12px; background: var(--gray-100); color: var(--gray-600);
  border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer;
}
.reset-msg { font-size: 12px; color: var(--gray-600); }

@media (max-width: 900px) {
  .section-header { flex-direction: column; gap: 16px; }
  .tutors-table { font-size: 14px; }
  .tutors-table th, .tutors-table td { padding: 12px 16px; }
}
</style>