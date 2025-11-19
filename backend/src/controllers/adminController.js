const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login.',
      error: error.message
    });
  }
};

module.exports = {
  adminLogin
};



