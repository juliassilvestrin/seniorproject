// course routes - public endpoint for the courses page
// returns all courses with their assigned tutors nested inside

const express = require('express')
const Course = require('../models/Course')
const User = require('../models/User')
const Schedule = require('../models/Schedule')

const router = express.Router()

// helper to format 24hr time to 12hr
const formatTime = (t) => {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

// GET /api/courses
// returns all courses, each with a list of tutors who cover that course
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ code: 1 })
    const activeTutors = await User.find({ isActive: true })
    const allSlots = await Schedule.find({
      user: { $in: activeTutors.map(t => t._id) }
    })

    // figure out availability for each tutor
    const now = new Date()
    const dayMap = [6, 0, 1, 2, 3, 4, 5]
    const todayIndex = dayMap[now.getDay()]
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const result = courses.map(course => {
      // find tutors who have this course in their courses array
      const tutors = activeTutors
        .filter(t => t.courses.includes(course.code))
        .map(tutor => {
          const tutorSlots = allSlots.filter(s => s.user.toString() === tutor._id.toString())

          // check if tutor is available right now
          let available = false
          let nextAvailable = ''

          for (const slot of tutorSlots) {
            if (slot.dayOfWeek === todayIndex) {
              const [sh, sm] = slot.startTime.split(':').map(Number)
              const [eh, em] = slot.endTime.split(':').map(Number)
              if (currentMinutes >= sh * 60 + sm && currentMinutes < eh * 60 + em) {
                available = true
                break
              }
            }
          }

          if (!available) {
            // find next available time
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
            for (let offset = 0; offset < 5; offset++) {
              const checkDay = (todayIndex + offset) % 5
              const daySlots = tutorSlots
                .filter(s => s.dayOfWeek === checkDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))

              for (const slot of daySlots) {
                const [sh, sm] = slot.startTime.split(':').map(Number)
                if (offset === 0 && sh * 60 + sm > currentMinutes) {
                  nextAvailable = `Today, ${formatTime(slot.startTime)}`
                  break
                } else if (offset > 0) {
                  nextAvailable = `${dayNames[checkDay]}, ${formatTime(slot.startTime)}`
                  break
                }
              }
              if (nextAvailable) break
            }
          }

          return {
            name: tutor.name,
            initials: tutor.initials,
            role: tutor.role,
            available,
            nextAvailable
          }
        })

      return {
        id: course._id,
        code: course.code,
        name: course.name,
        description: course.description,
        tutors
      }
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
