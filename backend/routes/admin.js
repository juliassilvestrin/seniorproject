// admin routes - only accessible by users with the Admin role
// manages tutors, courses, and invite codes

const express = require('express')
const User = require('../models/User')
const Course = require('../models/Course')
const InviteCode = require('../models/InviteCode')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const generateInviteCode = require('../utils/generateInviteCode')

const router = express.Router()

// all routes here require auth + admin
router.use(auth, admin)

// ==========================================
// TUTOR MANAGEMENT
// ==========================================

// GET /api/admin/tutors
// list all tutors (including inactive ones)
router.get('/tutors', async (req, res, next) => {
  try {
    const tutors = await User.find().sort({ name: 1 })

    const result = tutors.map(t => ({
      id: t._id,
      name: t.name,
      initials: t.initials,
      email: t.email,
      role: t.role,
      courses: t.courses,
      isActive: t.isActive
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/tutors/:id/active
// toggle a tutor's active status (activate/deactivate)
router.patch('/tutors/:id/active', async (req, res, next) => {
  try {
    const tutor = await User.findById(req.params.id)
    if (!tutor) {
      return res.status(404).json({ message: 'tutor not found' })
    }

    tutor.isActive = !tutor.isActive
    await tutor.save()

    res.json({
      id: tutor._id,
      name: tutor.name,
      isActive: tutor.isActive
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/tutors/:id/role
// change a tutor's role (e.g. promote to admin or senior tutor)
router.patch('/tutors/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body
    const validRoles = ['Tutor', 'Senior Tutor', 'Admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'invalid role' })
    }

    const tutor = await User.findById(req.params.id)
    if (!tutor) {
      return res.status(404).json({ message: 'tutor not found' })
    }

    tutor.role = role
    await tutor.save()

    res.json({ id: tutor._id, name: tutor.name, role: tutor.role })
  } catch (err) {
    next(err)
  }
})

// ==========================================
// COURSE MANAGEMENT
// ==========================================

// GET /api/admin/courses
// list all courses with tutor count
router.get('/courses', async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ code: 1 })
    const users = await User.find({ isActive: true })

    const result = courses.map(c => ({
      id: c._id,
      code: c.code,
      name: c.name,
      description: c.description,
      tutorCount: users.filter(u => u.courses.includes(c.code)).length
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/courses
// create a new course
router.post('/courses', async (req, res, next) => {
  try {
    const { code, name, description } = req.body
    const course = await Course.create({
      code,
      name,
      description: description || ''
    })

    res.status(201).json({
      id: course._id,
      code: course.code,
      name: course.name,
      description: course.description,
      tutorCount: 0
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/courses/:id
// delete a course
router.delete('/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'course not found' })
    }

    res.json({ message: 'course deleted' })
  } catch (err) {
    next(err)
  }
})

// ==========================================
// INVITE CODE MANAGEMENT
// ==========================================

// GET /api/admin/invite-codes
// list all invite codes
router.get('/invite-codes', async (req, res, next) => {
  try {
    const codes = await InviteCode.find()
      .populate('createdBy', 'name')
      .populate('usedBy', 'name')
      .sort({ createdAt: -1 })

    const result = codes.map(c => ({
      id: c._id,
      code: c.code,
      role: c.role,
      createdAt: c.createdAt,
      expiresAt: c.expiresAt,
      status: c.status,
      usedBy: c.usedBy ? c.usedBy.name : null,
      usedAt: c.usedAt
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/invite-codes
// generate a new invite code
router.post('/invite-codes', async (req, res, next) => {
  try {
    const { role } = req.body

    // generate a unique code
    let code
    let exists = true
    while (exists) {
      code = generateInviteCode()
      exists = await InviteCode.findOne({ code })
    }

    // default expiration: 30 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const inviteCode = await InviteCode.create({
      code,
      role: role || 'Tutor',
      createdBy: req.user._id,
      expiresAt
    })

    res.status(201).json({
      id: inviteCode._id,
      code: inviteCode.code,
      role: inviteCode.role,
      createdAt: inviteCode.createdAt,
      expiresAt: inviteCode.expiresAt,
      status: inviteCode.status
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/invite-codes/:id
// revoke an invite code (soft delete - sets status to revoked)
router.delete('/invite-codes/:id', async (req, res, next) => {
  try {
    const code = await InviteCode.findById(req.params.id)
    if (!code) {
      return res.status(404).json({ message: 'invite code not found' })
    }

    code.status = 'revoked'
    await code.save()

    res.json({ message: 'invite code revoked' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
