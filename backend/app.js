// express app setup - separated from server.js so tests can import without starting a server

const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// mount route groups
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tutors', require('./routes/tutors'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/schedule', require('./routes/schedule'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/upload', require('./routes/upload'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

module.exports = app
