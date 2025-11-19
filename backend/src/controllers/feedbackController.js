const Feedback = require('../models/Feedback');

// Submit anonymous feedback
const submitFeedback = async (req, res) => {
  try {
    const { title, content, category, tags, contactEmail } = req.body;

    const feedback = new Feedback({
      title,
      content,
      category,
      tags: tags || [],
      contactEmail: contactEmail || undefined,
      isPublic: true,
      status: 'open'
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      data: {
        id: feedback._id,
        title: feedback.title,
        category: feedback.category,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback.',
      error: error.message
    });
  }
};

// Get public feedback list (paginated)
const getPublicFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Build query
    const query = { isPublic: true };
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const feedback = await Feedback.find(query)
      .select('-contactEmail -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter replies to show only public ones
    const publicFeedback = feedback.map(item => ({
      ...item,
      replies: item.replies.filter(reply => reply.public)
    }));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        feedback: publicFeedback,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
};

// Get single public feedback
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id).lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.'
      });
    }

    if (!feedback.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'This feedback is not publicly available.'
      });
    }

    // Remove sensitive fields and filter public replies
    const publicFeedback = {
      ...feedback,
      contactEmail: undefined,
      replies: feedback.replies.filter(reply => reply.public)
    };

    res.status(200).json({
      success: true,
      data: publicFeedback
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
};

// Admin: Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category || '';
    const status = req.query.status || '';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
};

// Admin: Get single feedback with all details
const getFeedbackByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
};

// Admin: Update feedback status
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully.',
      data: feedback
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating feedback status.',
      error: error.message
    });
  }
};

// Admin: Add reply to feedback
const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, public: isPublic = false } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required.'
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.'
      });
    }

    const reply = {
      message: message.trim(),
      public: isPublic,
      createdAt: Date.now()
    };

    feedback.replies.push(reply);
    feedback.updatedAt = Date.now();
    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Reply added successfully.',
      data: feedback
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error adding reply.',
      error: error.message
    });
  }
};

// Admin: Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully.'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback.',
      error: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getPublicFeedback,
  getFeedbackById,
  getAllFeedback,
  getFeedbackByIdAdmin,
  updateFeedbackStatus,
  addReply,
  deleteFeedback
};



