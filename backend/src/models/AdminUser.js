const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);



