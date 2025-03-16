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
    const ratingCategories = ['reliability', 'intelligence', 'funFactor', 'trustworthiness', 'loyalty', 'honesty'];
    for (const category of ratingCategories) {
      if (ratings[category] === undefined || ratings[category] < -3 || ratings[category] > 3) {
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
 * Verify password and get feedback for a user
 * @route POST /api/feedback/verify
 * @access Public
 */
const verifyAndGetFeedback = async (req, res) => {
  try {
    const { uniqueId, password } = req.body;

    if (!uniqueId || !password) {
      return res.status(400).json({ message: 'Unique ID and password are required' });
    }

    // Find user by uniqueId
    const user = await User.findOne({ uniqueId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Count total feedback for the user
    const feedbackCount = await Feedback.countDocuments({ userId: user._id });

    // Check if there are at least 3 feedback entries
    if (feedbackCount < 3) {
      return res.status(403).json({
        message: 'Not enough feedback',
        count: feedbackCount,
        required: 3,
      });
    }

    // Get all feedback for the user
    const feedback = await Feedback.find({ userId: user._id });

    // Calculate average ratings
    const averageRatings = {
      reliability: 0,
      intelligence: 0,
      funFactor: 0,
      trustworthiness: 0,
      loyalty: 0,
      honesty: 0,
      overall: 0,
    };

    feedback.forEach((item) => {
      averageRatings.reliability += item.ratings.reliability;
      averageRatings.intelligence += item.ratings.intelligence;
      averageRatings.funFactor += item.ratings.funFactor;
      averageRatings.trustworthiness += item.ratings.trustworthiness;
      averageRatings.honesty += item.ratings.honesty;
      averageRatings.loyalty += item.ratings.loyalty || 0;
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
          averageRatings.intelligence +
          averageRatings.funFactor +
          averageRatings.trustworthiness +
          averageRatings.loyalty +
          averageRatings.honesty) /
        6
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

/**
 * Get feedback for a user (protected route)
 * @route GET /api/feedback/:userId
 * @access Private (requires JWT token and password verification)
 */
const getFeedback = async (req, res) => {
  try {
    const { userId } = req.params;

    // User is already authenticated and password verified via middleware
    // We can use req.user from the middleware if needed

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
      intelligence: 0,
      funFactor: 0,
      trustworthiness: 0,
      loyalty: 0,
      honesty: 0,
      overall: 0,
    };

    feedback.forEach((item) => {
      // Handle both old (1-5) and new (-3 to 3) rating scales
      const isOldScale = item.ratings.reliability > 3; // If rating > 3, it's from the old 1-5 scale
      
      if (isOldScale) {
        // Convert old scale (1-5) to new scale (-3 to 3)
        averageRatings.reliability += convertOldToNewScale(item.ratings.reliability);
        averageRatings.intelligence += convertOldToNewScale(item.ratings.intelligence);
        averageRatings.funFactor += convertOldToNewScale(item.ratings.funFactor);
        averageRatings.trustworthiness += convertOldToNewScale(item.ratings.trustworthiness);
        averageRatings.honesty += convertOldToNewScale(item.ratings.honesty);
        if (item.ratings.loyalty) {
          averageRatings.loyalty += convertOldToNewScale(item.ratings.loyalty);
        } else {
          // If loyalty doesn't exist in old data, use a neutral value
          averageRatings.loyalty += 0;
        }
      } else {
        // New scale (-3 to 3)
        averageRatings.reliability += item.ratings.reliability;
        averageRatings.intelligence += item.ratings.intelligence;
        averageRatings.funFactor += item.ratings.funFactor;
        averageRatings.trustworthiness += item.ratings.trustworthiness;
        averageRatings.honesty += item.ratings.honesty;
        averageRatings.loyalty += item.ratings.loyalty || 0;
      }
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
          averageRatings.intelligence +
          averageRatings.funFactor +
          averageRatings.trustworthiness +
          averageRatings.loyalty +
          averageRatings.honesty) /
        6
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
  getFeedback,
  verifyAndGetFeedback
}; 