const validateFeedback = (req, res, next) => {
  const { title, content, category } = req.body;

  // Check required fields
  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: 'Title, content, and category are required fields.'
    });
  }

  // Validate title length
  if (title.length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Title must be 150 characters or less.'
    });
  }

  // Validate category
  const validCategories = ['Canteen', 'Academics', 'Hostel', 'Infrastructure', 'Transport', 'Other'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${validCategories.join(', ')}`
    });
  }

  // Validate tags if provided
  if (req.body.tags && !Array.isArray(req.body.tags)) {
    return res.status(400).json({
      success: false,
      message: 'Tags must be an array of strings.'
    });
  }

  // Validate email format if provided
  if (req.body.contactEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.'
      });
    }
  }

  next();
};

const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  next();
};

module.exports = { validateFeedback, validateAdminLogin };



