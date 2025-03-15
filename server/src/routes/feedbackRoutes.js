const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { verifyPassword } = require('../middleware/passwordMiddleware');

const router = express.Router();

// Submit feedback
router.post('/', (req, res) => {
  return feedbackController.submitFeedback(req, res);
});

// Verify password and get feedback (public route with password in body)
router.post('/verify', (req, res) => {
  return feedbackController.verifyAndGetFeedback(req, res);
});

// Get feedback (protected route with password verification)
router.get('/:userId', 
  protect, // First verify JWT token
  verifyPassword(), // Then verify password
  (req, res) => feedbackController.getFeedback(req, res)
);

module.exports = router; 