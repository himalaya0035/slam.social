const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit feedback
router.post('/', (req, res) => {
  return feedbackController.submitFeedback(req, res);
});

// Get feedback (protected route)
router.get('/:userId', 
  (req, res, next) => protect(req, res, next),
  (req, res) => feedbackController.getFeedback(req, res)
);

module.exports = router; 