// connects to mongodb using mongoose
// called once from server.js when the app starts up

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`mongodb connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`mongodb connection error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
