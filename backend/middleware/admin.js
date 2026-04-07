// admin middleware - must be used after auth middleware
// checks if the logged-in user has the Admin role

const admin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'admin access required' })
  }
  next()
}

module.exports = admin
