// resets all tutor passwords back to defaults without wiping any other data
// run with: npm run reset-passwords
// or on railway: railway run node reset-passwords.js

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')

dotenv.config()

const passwords = {
  'd00479588@utahtech.edu': 'julia1',
  'jarod@utahtech.edu':     'tutoring123',
  'austin@utahtech.edu':    'tutoring123',
  'drew@utahtech.edu':      'tutoring123',
  'theisen@utahtech.edu':   'tutoring123'
}

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to mongodb')

    for (const [email, password] of Object.entries(passwords)) {
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        console.log(`  not found: ${email}`)
        continue
      }
      user.password = password
      await user.save() // pre-save hook handles bcrypt hashing
      console.log(`  reset password for: ${email}`)
    }

    console.log('\ndone! passwords reset to defaults.')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('error:', err)
    process.exit(1)
  }
}

reset()
