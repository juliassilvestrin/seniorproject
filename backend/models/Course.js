// course model - stores the course catalog
// tutors are linked through the User model's courses array, not here

const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'course code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'course name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Course', courseSchema)
