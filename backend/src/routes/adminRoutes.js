const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middlewares/auth');
const { validateAdminLogin } = require('../middlewares/validation');

// Admin authentication
router.post('/auth/login', validateAdminLogin, adminController.adminLogin);

// Admin feedback management (all protected)
router.get('/feedback', authMiddleware, feedbackController.getAllFeedback);
router.get('/feedback/:id', authMiddleware, feedbackController.getFeedbackByIdAdmin);
router.put('/feedback/:id/status', authMiddleware, feedbackController.updateFeedbackStatus);
router.post('/feedback/:id/reply', authMiddleware, feedbackController.addReply);
router.delete('/feedback/:id', authMiddleware, feedbackController.deleteFeedback);

module.exports = router;



