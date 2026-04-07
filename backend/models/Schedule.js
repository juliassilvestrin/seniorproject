// schedule model - stores recurring weekly time slots for tutors
// dayOfWeek is 0-4 (mon-fri), not tied to specific dates
// absences handle date-specific overrides separately

const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 4 // 0=monday, 4=friday
  },
  startTime: {
    type: String,
    required: [true, 'start time is required'] // "09:00" format
  },
  endTime: {
    type: String,
    required: [true, 'end time is required'] // "12:00" format
  },
  location: {
    type: String,
    default: 'Smith Building, Common Area'
  },
  courses: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

// index for fast lookups by tutor and day
scheduleSchema.index({ user: 1, dayOfWeek: 1 })

module.exports = mongoose.model('Schedule', scheduleSchema)
