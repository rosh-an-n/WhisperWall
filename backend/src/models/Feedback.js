const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 150,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Canteen', 'Academics', 'Hostel', 'Infrastructure', 'Transport', 'Other'],
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  replies: {
    type: [replySchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);



