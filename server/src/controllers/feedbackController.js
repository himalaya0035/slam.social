const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { validateComment } = require('../utils/generators');

/**
 * Submit feedback for a user
 * @route POST /api/feedback
 * @access Public
 */
const submitFeedback = async (req, res) => {
  try {
    const { uniqueId, ratings, comment } = req.body;

    if (!uniqueId || !ratings || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate ratings
    const ratingCategories = ['reliability', 'trustworthiness', 'honesty', 'intelligence', 'funFactor'];
    for (const category of ratingCategories) {
      if (!ratings[category] || ratings[category] < 1 || ratings[category] > 5) {
        return res.status(400).json({ message: `Invalid rating for ${category}` });
      }
    }

    // Validate comment
    if (!validateComment(comment)) {
      return res.status(400).json({ message: 'Invalid comment' });
    }

    // Find user by uniqueId
    const user = await User.findOne({ uniqueId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new feedback
    const feedback = new Feedback({
      userId: user._id,
      ratings,
      comment,
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get feedback for a user
 * @route GET /api/feedback/:userId
 * @access Private
 */
const getFeedback = async (req, res) => {
  try {
    const { userId } = req.params;

    // Count total feedback for the user
    const feedbackCount = await Feedback.countDocuments({ userId });

    // Check if there are at least 5 feedback entries
    if (feedbackCount < 5) {
      return res.status(403).json({
        message: 'Not enough feedback',
        count: feedbackCount,
        required: 5,
      });
    }

    // Get all feedback for the user
    const feedback = await Feedback.find({ userId });

    // Calculate average ratings
    const averageRatings = {
      reliability: 0,
      trustworthiness: 0,
      honesty: 0,
      intelligence: 0,
      funFactor: 0,
      overall: 0,
    };

    feedback.forEach((item) => {
      averageRatings.reliability += item.ratings.reliability;
      averageRatings.trustworthiness += item.ratings.trustworthiness;
      averageRatings.honesty += item.ratings.honesty;
      averageRatings.intelligence += item.ratings.intelligence;
      averageRatings.funFactor += item.ratings.funFactor;
    });

    // Calculate averages
    for (const key in averageRatings) {
      if (key !== 'overall') {
        averageRatings[key] = parseFloat(
          (averageRatings[key] / feedbackCount).toFixed(1)
        );
      }
    }

    // Calculate overall average
    averageRatings.overall = parseFloat(
      (
        (averageRatings.reliability +
          averageRatings.trustworthiness +
          averageRatings.honesty +
          averageRatings.intelligence +
          averageRatings.funFactor) /
        5
      ).toFixed(1)
    );

    // Get all comments
    const comments = feedback.map((item) => item.comment);

    res.status(200).json({
      averageRatings,
      comments,
      count: feedbackCount,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitFeedback,
  getFeedback
}; 