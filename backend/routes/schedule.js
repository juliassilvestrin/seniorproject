// schedule routes - public endpoint for the schedule page and tv display
// returns all weekly time slots grouped by day

const express = require('express')
const Schedule = require('../models/Schedule')
const User = require('../models/User')

const router = express.Router()

// helper to format 24hr time to 12hr
const formatTime = (t) => {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

// GET /api/schedule
// returns all schedule slots with tutor info, for the public schedule page and tv display
router.get('/', async (req, res, next) => {
  try {
    // get all slots and populate the tutor info
    const slots = await Schedule.find()
      .populate('user', 'name initials photo courses isActive')
      .sort({ dayOfWeek: 1, startTime: 1 })

    // filter out slots for inactive tutors
    const activeSlots = slots.filter(slot => slot.user && slot.user.isActive)

    const result = activeSlots.map(slot => ({
      id: slot._id,
      dayIndex: slot.dayOfWeek,
      tutor: slot.user.name,
      initials: slot.user.initials,
      photo: slot.user.photo || '',
      time: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      location: slot.location,
      courses: slot.courses.length > 0 ? slot.courses : slot.user.courses
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
