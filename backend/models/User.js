// user model - stores tutor and admin accounts
// handles password hashing and slug generation automatically on save

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const generateSlug = require('../utils/generateSlug')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true
  },
  initials: {
    type: String,
    maxlength: 3
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    match: [/@utahtech\.edu$/, 'must be a @utahtech.edu email']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 6,
    select: false // don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['Tutor', 'Senior Tutor', 'Admin'],
    default: 'Tutor'
  },
  slug: {
    type: String,
    unique: true
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  tagline: {
    type: String,
    default: ''
  },
  specialization: {
    type: String,
    default: ''
  },
  aboutParagraphs: {
    type: [String],
    default: []
  },
  courses: {
    type: [String],
    default: []
  },
  stats: [{
    value: String,
    label: String
  }],
  photo: {
    type: String,
    default: ''  // cloudinary url, empty means show initials
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
})

// before saving, hash password and generate slug + initials
userSchema.pre('save', async function () {
  // hash password if it was changed
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  // generate slug from name
  if (this.isModified('name')) {
    this.slug = generateSlug(this.name)
  }

  // generate initials from name (first letter of each word)
  if (this.isModified('name')) {
    this.initials = this.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3)
  }
})

// compare a plain text password with the hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
