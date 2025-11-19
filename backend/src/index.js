require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'WhisperWall API is running.',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whisperwall')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5555;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;



