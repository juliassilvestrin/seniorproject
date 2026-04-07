// absence model - tracks when a tutor will be out
// used to filter them out of the schedule on specific dates

const mongoose = require('mongoose')

const absenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'date is required']
  },
  reason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

// index for looking up absences by tutor and date
absenceSchema.index({ user: 1, date: 1 })

module.exports = mongoose.model('Absence', absenceSchema)
