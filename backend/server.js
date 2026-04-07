// main entry point for the backend api
// sets up express, connects to mongodb, and mounts all route groups

const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = require('./app')

// load environment variables from .env
dotenv.config()

// start server
const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

start()
