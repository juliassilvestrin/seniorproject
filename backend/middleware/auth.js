// jwt auth middleware
// checks for a valid token in the Authorization header
// attaches the user to req.user so routes can use it

const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // grab token from "Bearer <token>" header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'no token, access denied' })
    }

    const token = authHeader.split(' ')[1]

    // verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // find the user and attach to request (without password)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'user not found' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'invalid token' })
  }
}

module.exports = auth
