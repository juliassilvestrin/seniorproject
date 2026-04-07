// upload route - handles profile photo uploads to cloudinary
const express = require('express')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

// configure cloudinary with env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// store upload in memory so we can pipe it to cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb max
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('only image files allowed'))
    }
    cb(null, true)
  }
})

// POST /api/upload/avatar
// upload a profile photo - requires auth
router.post('/avatar', auth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'no file uploaded' })
    }

    // upload buffer to cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'tutoring-avatars',
          public_id: `avatar-${req.user._id}`,
          overwrite: true,
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    // save photo url to user record
    await User.findByIdAndUpdate(req.user._id, { photo: result.secure_url })

    res.json({ photo: result.secure_url })
  } catch (err) {
    next(err)
  }
})

module.exports = router
