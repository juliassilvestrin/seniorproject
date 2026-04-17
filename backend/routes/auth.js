// auth routes - login, register, and get current user
// register requires a valid invite code from an admin

const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const InviteCode = require('../models/InviteCode')
const auth = require('../middleware/auth')

const router = express.Router()

// I pack the user id and role into the token so I don't have to hit the database on every request
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /api/auth/verify-code
// checks the invite code before showing the registration form
router.post('/verify-code', async (req, res) => {
  const { code } = req.body

  if (!code) return res.status(400).json({ message: 'invite code is required' })

  const inviteCode = await InviteCode.findOne({ code: code.trim(), status: 'active' })

  if (!inviteCode || new Date() > inviteCode.expiresAt) {
    return res.status(400).json({ message: 'invalid or expired invite code' })
  }

  res.json({ valid: true, role: inviteCode.role })
})

// POST /api/auth/register
// you can only register with an invite code - the role is set by the code, not the user
router.post('/register', async (req, res, next) => {
  try {
    const { inviteCode, firstName, lastName, email, password } = req.body

    // I check the code again here even though verify-code already checked it
    // someone could skip that step and POST directly to this endpoint
    const code = await InviteCode.findOne({
      code: inviteCode,
      status: 'active'
    })

    if (!code) {
      return res.status(400).json({ message: 'invalid or expired invite code' })
    }

    if (new Date() > code.expiresAt) {
      return res.status(400).json({ message: 'invite code has expired' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'email already registered' })
    }

    const name = `${firstName} ${lastName}`
    const user = await User.create({
      name,
      email,
      password,
      role: code.role
    })

    // mark the code as used so nobody can register with it again
    code.status = 'used'
    code.usedBy = user._id
    code.usedAt = new Date()
    await code.save()

    const token = createToken(user)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    // password is excluded from queries by default so I have to explicitly ask for it
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      // same message for wrong email or wrong password - don't reveal which one failed
      return res.status(401).json({ message: 'invalid email or password' })
    }

    const token = createToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
// the auth middleware runs first and attaches req.user so I know who's asking
router.get('/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    initials: req.user.initials,
    email: req.user.email,
    role: req.user.role,
    bio: req.user.bio,
    tagline: req.user.tagline,
    specialization: req.user.specialization,
    courses: req.user.courses,
    stats: req.user.stats,
    photo: req.user.photo,
    isActive: req.user.isActive
  })
})

module.exports = router
