// global error handler middleware
// catches any errors that routes/middleware don't handle
// returns clean error messages instead of stack traces

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500
  let message = err.message || 'server error'

  // mongoose validation error - bad input data
  if (err.name === 'ValidationError') {
    status = 400
    const fields = Object.values(err.errors).map(e => e.message)
    message = fields.join(', ')
  }

  // mongoose duplicate key error - unique field conflict
  if (err.code === 11000) {
    status = 400
    const field = Object.keys(err.keyValue)[0]
    message = `that ${field} already exists`
  }

  // jwt errors
  if (err.name === 'JsonWebTokenError') {
    status = 401
    message = 'invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    status = 401
    message = 'token expired'
  }

  res.status(status).json({ message })
}

module.exports = errorHandler
