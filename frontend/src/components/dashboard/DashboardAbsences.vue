<template>
  <div class="absences-section">
    <!-- page header -->
    <div class="section-header">
      <div>
        <h2>Manage Absences</h2>
        <p>Let students know when you won't be available</p>
      </div>
    </div>

    <!-- add absence form - always visible -->
    <div class="card" style="margin-bottom: 24px">
      <div class="card-header">
        <h3>Report an Absence</h3>
      </div>
      <div class="card-body">
        <form class="absence-form" @submit.prevent="addAbsence">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date</label>
              <!-- min prevents selecting past dates -->
              <input type="date" v-model="newAbsence.date" class="form-input" :min="today">
            </div>
            <div class="form-group">
              <label class="form-label">Reason (optional)</label>
              <input type="text" v-model="newAbsence.reason" class="form-input" placeholder="e.g., Doctor's appointment, exam prep...">
            </div>
          </div>
          <div class="form-actions">
            <!-- disabled until a date is selected -->
            <button type="submit" class="btn btn-primary" :disabled="!newAbsence.date">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Mark Absence
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- list of upcoming absences -->
    <div class="card">
      <div class="card-header">
        <h3>Upcoming Absences</h3>
        <!-- shows how many absences are listed -->
        <span class="count-badge">{{ absences.length }}</span>
      </div>
      <div class="card-body">
        <div v-if="absences.length > 0" class="absence-list">
          <div
            v-for="(absence, index) in absences"
            :key="index"
            class="absence-item"
          >
            <div class="absence-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="absence-details">
              <div class="absence-date">{{ absence.date }}</div>
              <div class="absence-reason">{{ absence.reason || 'No reason provided' }}</div>
            </div>
            <!-- cancel button to remove the absence -->
            <button class="btn btn-danger-outline" @click="removeAbsence(index)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
        <!-- empty state when no absences reported -->
        <div v-else class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>No upcoming absences — you're all set!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tutorService } from '@/services/tutors'

export default {
  name: 'DashboardAbsences',

  data() {
    return {
      absences: [],  // fetched from api
      isLoading: true,
      newAbsence: {
        date: '',
        reason: ''
      }
    }
  },

  computed: {
    // get today's date in yyyy-mm-dd format for the min attribute
    today() {
      return new Date().toISOString().split('T')[0]
    }
  },

  async created() {
    await this.loadAbsences()
  },

  methods: {
    // fetch absences from the api
    async loadAbsences() {
      try {
        const data = await tutorService.getMyAbsences()
        // format dates for display
        this.absences = data.map(a => ({
          id: a.id,
          date: new Date(a.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          reason: a.reason || 'No reason provided'
        }))
      } catch (err) {
        console.error('failed to load absences:', err)
      } finally {
        this.isLoading = false
      }
    },

    // send new absence to backend
    async addAbsence() {
      if (!this.newAbsence.date) return
      try {
        await tutorService.addAbsence({
          date: this.newAbsence.date,
          reason: this.newAbsence.reason || ''
        })
        this.newAbsence = { date: '', reason: '' }
        await this.loadAbsences() // reload to get fresh data
      } catch (err) {
        console.error('failed to add absence:', err)
      }
    },

    // remove absence by index via api
    async removeAbsence(index) {
      const absence = this.absences[index]
      if (!absence) return
      try {
        await tutorService.removeAbsence(absence.id)
        this.absences.splice(index, 1)
      } catch (err) {
        console.error('failed to remove absence:', err)
      }
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

/* buttons */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
  cursor: pointer; transition: all 0.2s ease; border: none;
}
.btn-primary { background: var(--utu-red); color: white; }
.btn-primary:hover { background: var(--utu-red-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-danger-outline {
  background: transparent;
  color: #DC2626;
  border: 1px solid rgba(220, 38, 38, 0.3);
  padding: 8px 16px;
  font-size: 14px;
}
.btn-danger-outline:hover {
  background: rgba(220, 38, 38, 0.05);
  border-color: #DC2626;
}

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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); }
.card-body { padding: 24px; }

.count-badge {
  background: var(--gray-100);
  color: var(--gray-600);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
}

/* form */
.absence-form { display: flex; flex-direction: column; gap: 20px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-size: 14px; font-weight: 600; color: var(--navy); }

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

.form-actions { display: flex; justify-content: flex-end; }

/* absence list */
.absence-list { display: flex; flex-direction: column; gap: 12px; }

.absence-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.1);
  border-radius: 12px;
}

.absence-icon {
  width: 44px; height: 44px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #DC2626;
  flex-shrink: 0;
}

.absence-details { flex: 1; }
.absence-date { font-size: 16px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
.absence-reason { font-size: 14px; color: var(--gray-400); }

/* empty state */
.empty-state { text-align: center; padding: 48px; color: var(--gray-400); }
.empty-state svg { margin-bottom: 12px; opacity: 0.5; }
.empty-state p { font-size: 14px; }

@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>