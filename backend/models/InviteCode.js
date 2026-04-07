// invite code model - registration codes that admins generate
// tutors need a valid code to create an account
// codes can be active, used, or revoked (soft delete)

const mongoose = require('mongoose')

const inviteCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Tutor', 'Senior Tutor'],
    default: 'Tutor'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'used', 'revoked'],
    default: 'active'
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('InviteCode', inviteCodeSchema)
