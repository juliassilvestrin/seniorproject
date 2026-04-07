// auth routes - login, register, and get current user
// register requires a valid invite code from an admin

const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const InviteCode = require('../models/InviteCode')
const auth = require('../middleware/auth')

const router = express.Router()

// helper to create a jwt token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// POST /api/auth/verify-code
// step 1 of registration - checks if an invite code is valid before showing the form
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
// creates a new tutor account using an invite code
router.post('/register', async (req, res, next) => {
  try {
    const { inviteCode, firstName, lastName, email, password } = req.body

    // find the invite code and make sure it's valid
    const code = await InviteCode.findOne({
      code: inviteCode,
      status: 'active'
    })

    if (!code) {
      return res.status(400).json({ message: 'invalid or expired invite code' })
    }

    // check if code is expired
    if (new Date() > code.expiresAt) {
      return res.status(400).json({ message: 'invite code has expired' })
    }

    // check if email is already taken
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'email already registered' })
    }

    // create the user with the role from the invite code
    const name = `${firstName} ${lastName}`
    const user = await User.create({
      name,
      email,
      password,
      role: code.role
    })

    // mark the invite code as used
    code.status = 'used'
    code.usedBy = user._id
    code.usedAt = new Date()
    await code.save()

    // send back jwt
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
// logs in with email and password, returns jwt
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    // find user and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'invalid email or password' })
    }

    // check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'invalid email or password' })
    }

    // send back jwt
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
// returns the currently logged-in user's info
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
