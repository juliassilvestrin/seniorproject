<template>
  <div class="schedule-section">
    <!-- section header with title and add button -->
    <div class="section-header">
      <div>
        <h2>My Schedule</h2>
        <p>Manage your weekly tutoring time slots</p>
      </div>
      <!-- toggle the add slot form -->
      <button class="btn btn-primary" @click="showAddForm = !showAddForm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Time Slot
      </button>
    </div>

    <!-- add slot form - toggled by the button above -->
    <div v-if="showAddForm" class="add-form card">
      <div class="card-header">
        <h3>Add New Time Slot</h3>
        <button class="close-btn" @click="showAddForm = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <!-- todo: add validation for overlapping time slots -->
        <form class="slot-form" @submit.prevent="addSlot">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Day of Week</label>
              <select v-model="newSlot.day" class="form-input">
                <option value="">Select a day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Start Time</label>
              <input type="time" v-model="newSlot.startTime" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">End Time</label>
              <input type="time" v-model="newSlot.endTime" class="form-input">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" v-model="newSlot.location" class="form-input" placeholder="Smith Building, Common Area">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showAddForm = false">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Slot</button>
          </div>
        </form>
      </div>
    </div>

    <!-- existing schedule slots list -->
    <div class="card">
      <div class="card-body">
        <div v-if="schedule.length > 0" class="schedule-list">
          <div
            v-for="(slot, index) in schedule"
            :key="index"
            class="schedule-item"
            :class="{ today: slot.isToday, editing: editingIndex === index }"
          >
            <!-- normal view -->
            <template v-if="editingIndex !== index">
              <div class="schedule-day">
                <div class="schedule-day-name">{{ slot.dayShort }}</div>
                <div class="schedule-day-date">{{ slot.date }}</div>
              </div>
              <div class="schedule-details">
                <div class="schedule-time">{{ slot.time }}</div>
                <div class="schedule-location">{{ slot.location }}</div>
              </div>
              <!-- edit and delete actions for each slot -->
              <div class="schedule-actions">
                <button class="icon-btn" title="Edit" @click="startEdit(index)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="icon-btn delete" title="Delete" @click="removeSlot(index)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </template>

            <!-- inline edit form -->
            <template v-else>
              <div class="edit-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Day</label>
                    <select v-model="editSlot.day" class="form-input">
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Start Time</label>
                    <input type="time" v-model="editSlot.startTime" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Time</label>
                    <input type="time" v-model="editSlot.endTime" class="form-input">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Location</label>
                  <input type="text" v-model="editSlot.location" class="form-input">
                </div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                  <button type="button" class="btn btn-primary" @click="saveEdit(index)">Save</button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- empty state when no slots exist yet -->
        <div v-else class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p>No time slots scheduled yet</p>
          <button class="btn btn-primary" style="margin-top: 16px" @click="showAddForm = true">Add Your First Slot</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tutorService } from '@/services/tutors'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default {
  name: 'DashboardSchedule',

  data() {
    return {
      showAddForm: false,
      isLoading: true,
      schedule: [], // fetched from api
      newSlot: {
        day: '',
        startTime: '',
        endTime: '',
        location: 'Smith Building, Common Area'
      },
      editingIndex: null,
      editSlot: { day: '', startTime: '', endTime: '', location: '' }
    }
  },

  async created() {
    await this.loadSchedule()
  },

  methods: {
    // fetch the tutor's schedule from the api and format for display
    async loadSchedule() {
      try {
        const slots = await tutorService.getMySchedule()

        // figure out dates for the current week
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

        this.schedule = slots.map(slot => {
          const slotDate = new Date(monday)
          slotDate.setDate(monday.getDate() + slot.dayOfWeek)

          const isToday =
            slotDate.getDate() === today.getDate() &&
            slotDate.getMonth() === today.getMonth() &&
            slotDate.getFullYear() === today.getFullYear()

          return {
            id: slot.id,
            dayOfWeek: slot.dayOfWeek,
            dayShort: DAY_SHORT[slot.dayOfWeek],
            date: String(slotDate.getDate()),
            startTime: slot.startTime,
            endTime: slot.endTime,
            time: slot.time,
            location: slot.location,
            isToday
          }
        })
      } catch (err) {
        console.error('failed to load schedule:', err)
      } finally {
        this.isLoading = false
      }
    },

    // add a new slot via api
    async addSlot() {
      if (!this.newSlot.day || !this.newSlot.startTime || !this.newSlot.endTime) return

      try {
        await tutorService.addScheduleSlot({
          dayOfWeek: DAY_NAMES.indexOf(this.newSlot.day),
          startTime: this.newSlot.startTime,
          endTime: this.newSlot.endTime,
          location: this.newSlot.location
        })
        this.newSlot = { day: '', startTime: '', endTime: '', location: 'Smith Building, Common Area' }
        this.showAddForm = false
        await this.loadSchedule() // reload to get fresh data
      } catch (err) {
        console.error('failed to add slot:', err)
      }
    },

    // delete a slot via api
    async removeSlot(index) {
      const slot = this.schedule[index]
      if (!slot) return
      try {
        await tutorService.removeScheduleSlot(slot.id)
        this.schedule.splice(index, 1)
      } catch (err) {
        console.error('failed to remove slot:', err)
      }
    },

    // open the inline edit form for a slot
    startEdit(index) {
      const slot = this.schedule[index]
      this.editingIndex = index
      this.editSlot = {
        day: DAY_NAMES[slot.dayOfWeek],
        startTime: slot.startTime,
        endTime: slot.endTime,
        location: slot.location
      }
    },

    cancelEdit() {
      this.editingIndex = null
    },

    // save edits to the slot via api
    async saveEdit(index) {
      const slot = this.schedule[index]
      try {
        await tutorService.updateScheduleSlot(slot.id, {
          dayOfWeek: DAY_NAMES.indexOf(this.editSlot.day),
          startTime: this.editSlot.startTime,
          endTime: this.editSlot.endTime,
          location: this.editSlot.location
        })
        this.editingIndex = null
        await this.loadSchedule()
      } catch (err) {
        console.error('failed to update slot:', err)
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

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.section-header p {
  font-size: 15px;
  color: var(--gray-600);
}

/* buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary { background: var(--utu-red); color: white; }
.btn-primary:hover { background: var(--utu-red-dark); }
.btn-secondary { background: var(--warm-white); color: var(--navy); border: 1px solid var(--gray-200); }
.btn-secondary:hover { background: var(--gray-100); }

/* card */
.card {
  background: var(--warm-white);
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
  margin-bottom: 24px;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
}

.card-body { padding: 24px; }

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover { color: var(--navy); }

/* form */
.slot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* schedule list */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--gray-100);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.schedule-item:hover { background: var(--gray-200); }

.schedule-item.today {
  background: rgba(186, 28, 33, 0.08);
  border: 1px solid rgba(186, 28, 33, 0.2);
}

.schedule-item.editing {
  background: var(--warm-white);
  border: 2px solid var(--utu-red);
  display: block;
  padding: 20px;
}

.schedule-item.editing:hover { background: var(--warm-white); }

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-day { width: 56px; text-align: center; }
.schedule-day-name { font-size: 12px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px; }
.schedule-day-date { font-size: 24px; font-weight: 700; color: var(--navy); }
.schedule-item.today .schedule-day-name,
.schedule-item.today .schedule-day-date { color: var(--utu-red); }
.schedule-details { flex: 1; }
.schedule-time { font-size: 15px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
.schedule-location { font-size: 13px; color: var(--gray-400); }

.schedule-actions { display: flex; gap: 8px; }

.icon-btn {
  width: 36px; height: 36px;
  border: 1px solid var(--gray-200);
  background: var(--warm-white);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--gray-600);
  transition: all 0.2s ease;
}

.icon-btn:hover { border-color: var(--gray-400); color: var(--navy); }
.icon-btn.delete:hover { border-color: #DC2626; color: #DC2626; background: rgba(220, 38, 38, 0.05); }

/* empty state */
.empty-state { text-align: center; padding: 48px; color: var(--gray-400); }
.empty-state svg { margin-bottom: 12px; opacity: 0.5; }
.empty-state p { font-size: 14px; }

@media (max-width: 768px) {
  .section-header { flex-direction: column; gap: 16px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
