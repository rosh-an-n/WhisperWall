const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { validateFeedback } = require('../middlewares/validation');
const { feedbackSubmissionLimiter } = require('../middlewares/rateLimiter');

// Public routes
router.post('/', feedbackSubmissionLimiter, validateFeedback, feedbackController.submitFeedback);
router.get('/', feedbackController.getPublicFeedback);
router.get('/:id', feedbackController.getFeedbackById);

module.exports = router;



