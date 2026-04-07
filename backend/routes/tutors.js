// tutor routes - public endpoints + protected "me" endpoints
// public: anyone can view tutor list and profiles
// protected: logged-in tutors can manage their own schedule, profile, absences

const express = require('express')
const User = require('../models/User')
const Schedule = require('../models/Schedule')
const Absence = require('../models/Absence')
const Course = require('../models/Course')
const auth = require('../middleware/auth')

const router = express.Router()

// helper to format 24hr time to 12hr
// "09:00" -> "9:00 AM", "14:30" -> "2:30 PM"
const formatTime = (t) => {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

// helper to check if a tutor is available right now
// looks at their schedule slots for today and checks the current time
const checkAvailability = (slots) => {
  const now = new Date()
  const dayMap = [6, 0, 1, 2, 3, 4, 5] // js sunday=0 -> our monday=0
  const todayIndex = dayMap[now.getDay()]

  // not a weekday we track
  if (todayIndex < 0 || todayIndex > 4) return { available: false, nextAvailable: '' }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const slot of slots) {
    if (slot.dayOfWeek === todayIndex) {
      const [sh, sm] = slot.startTime.split(':').map(Number)
      const [eh, em] = slot.endTime.split(':').map(Number)
      const start = sh * 60 + sm
      const end = eh * 60 + em

      if (currentMinutes >= start && currentMinutes < end) {
        return { available: true, nextAvailable: '' }
      }
    }
  }

  // find next available slot
  // todo: make this smarter about showing "Today, 1:00 PM" vs "Tue, 9:00 AM"
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  for (let offset = 0; offset < 5; offset++) {
    const checkDay = (todayIndex + offset) % 5
    const daySlots = slots
      .filter(s => s.dayOfWeek === checkDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    for (const slot of daySlots) {
      if (offset === 0) {
        // same day - only show future slots
        const [sh, sm] = slot.startTime.split(':').map(Number)
        if (sh * 60 + sm > currentMinutes) {
          return { available: false, nextAvailable: `Today, ${formatTime(slot.startTime)}` }
        }
      } else {
        return { available: false, nextAvailable: `${dayNames[checkDay]}, ${formatTime(slot.startTime)}` }
      }
    }
  }

  return { available: false, nextAvailable: '' }
}

// ==========================================
// PUBLIC ROUTES (no auth required)
// ==========================================

// GET /api/tutors
// returns all active tutors with their availability status
router.get('/', async (req, res, next) => {
  try {
    const tutors = await User.find({ isActive: true })

    // get schedule slots for all tutors to compute availability
    const allSlots = await Schedule.find({
      user: { $in: tutors.map(t => t._id) }
    })

    const result = tutors.map(tutor => {
      const tutorSlots = allSlots.filter(s => s.user.toString() === tutor._id.toString())
      const { available, nextAvailable } = checkAvailability(tutorSlots)

      return {
        name: tutor.name,
        initials: tutor.initials,
        photo: tutor.photo,
        slug: tutor.slug,
        role: tutor.role,
        bio: tutor.bio,
        specialization: tutor.specialization,
        courses: tutor.courses,
        available,
        nextAvailable
      }
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// GET /api/tutors/:slug
// returns a single tutor's full profile with schedule and course details
router.get('/:slug', async (req, res, next) => {
  try {
    const tutor = await User.findOne({ slug: req.params.slug, isActive: true })
    if (!tutor) {
      return res.status(404).json({ message: 'tutor not found' })
    }

    // get their schedule
    const slots = await Schedule.find({ user: tutor._id }).sort({ dayOfWeek: 1 })
    const { available } = checkAvailability(slots)

    // get full course info for courses they tutor
    const courseDetails = await Course.find({ code: { $in: tutor.courses } })

    // format schedule for the frontend
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const schedule = slots.map(slot => ({
      dayName: dayNames[slot.dayOfWeek],
      time: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      location: slot.location
    }))

    res.json({
      name: tutor.name,
      initials: tutor.initials,
      photo: tutor.photo,
      slug: tutor.slug,
      role: tutor.role,
      tagline: tutor.tagline,
      available,
      specialization: tutor.specialization,
      aboutParagraphs: tutor.aboutParagraphs,
      stats: tutor.stats,
      courses: tutor.courses,
      schedule,
      courseDetails: courseDetails.map(c => ({
        code: c.code,
        name: c.name,
        description: c.description
      }))
    })
  } catch (err) {
    next(err)
  }
})

// ==========================================
// PROTECTED ROUTES (auth required)
// ==========================================

// PUT /api/tutors/me/profile
// update your own profile info
router.put('/me/profile', auth, async (req, res, next) => {
  try {
    const allowed = ['bio', 'tagline', 'specialization', 'aboutParagraphs', 'courses', 'stats']
    const updates = {}
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    // also allow updating name (which regenerates slug and initials)
    if (req.body.firstName && req.body.lastName) {
      updates.name = `${req.body.firstName} ${req.body.lastName}`
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    })

    res.json({
      name: user.name,
      initials: user.initials,
      email: user.email,
      role: user.role,
      bio: user.bio,
      tagline: user.tagline,
      specialization: user.specialization,
      courses: user.courses,
      stats: user.stats
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/tutors/me/schedule
// get your own schedule slots
router.get('/me/schedule', auth, async (req, res, next) => {
  try {
    const slots = await Schedule.find({ user: req.user._id }).sort({ dayOfWeek: 1 })

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const result = slots.map(slot => ({
      id: slot._id,
      dayOfWeek: slot.dayOfWeek,
      dayName: dayNames[slot.dayOfWeek],
      startTime: slot.startTime,
      endTime: slot.endTime,
      time: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      location: slot.location,
      courses: slot.courses
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /api/tutors/me/schedule
// add a new time slot to your schedule
router.post('/me/schedule', auth, async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, location, courses } = req.body

    const slot = await Schedule.create({
      user: req.user._id,
      dayOfWeek,
      startTime,
      endTime,
      location: location || 'Smith Building, Common Area',
      courses: courses || req.user.courses
    })

    res.status(201).json({
      id: slot._id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      time: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      location: slot.location,
      courses: slot.courses
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/tutors/me/schedule/:id
// update an existing schedule slot
router.put('/me/schedule/:id', auth, async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, location } = req.body

    const slot = await Schedule.findOne({ _id: req.params.id, user: req.user._id })
    if (!slot) {
      return res.status(404).json({ message: 'slot not found' })
    }

    slot.dayOfWeek = dayOfWeek ?? slot.dayOfWeek
    slot.startTime = startTime ?? slot.startTime
    slot.endTime = endTime ?? slot.endTime
    slot.location = location ?? slot.location
    await slot.save()

    res.json({
      id: slot._id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      time: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      location: slot.location,
      courses: slot.courses
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/tutors/me/schedule/:id
// remove one of your schedule slots
router.delete('/me/schedule/:id', auth, async (req, res, next) => {
  try {
    const slot = await Schedule.findById(req.params.id)
    if (!slot) {
      return res.status(404).json({ message: 'slot not found' })
    }

    // make sure you can only delete your own slots
    if (slot.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'not your slot' })
    }

    await slot.deleteOne()
    res.json({ message: 'slot removed' })
  } catch (err) {
    next(err)
  }
})

// GET /api/tutors/me/absences
// get your reported absences
router.get('/me/absences', auth, async (req, res, next) => {
  try {
    const absences = await Absence.find({ user: req.user._id }).sort({ date: 1 })

    const result = absences.map(a => ({
      id: a._id,
      date: a.date,
      reason: a.reason
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /api/tutors/me/absences
// report that you'll be absent on a specific date
router.post('/me/absences', auth, async (req, res, next) => {
  try {
    const { date, reason } = req.body

    const absence = await Absence.create({
      user: req.user._id,
      date: new Date(date),
      reason: reason || ''
    })

    res.status(201).json({
      id: absence._id,
      date: absence.date,
      reason: absence.reason
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/tutors/me/absences/:id
// cancel a reported absence
router.delete('/me/absences/:id', auth, async (req, res, next) => {
  try {
    const absence = await Absence.findById(req.params.id)
    if (!absence) {
      return res.status(404).json({ message: 'absence not found' })
    }

    if (absence.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'not your absence' })
    }

    await absence.deleteOne()
    res.json({ message: 'absence removed' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
