const crypto = require('crypto');

/**
 * Generate a unique ID for a user
 * @returns A unique ID string
 */
const generateUniqueId = () => {
  // Generate a random string of 8 characters
  const randomString = crypto.randomBytes(4).toString('hex');
  // Add a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${timestamp}${randomString}`;
};

/**
 * Generate a random password for accessing results
 * @returns A random password string
 */
const generateRandomPassword = () => {
  // Generate a random string of 6 characters (alphanumeric)
  return crypto.randomBytes(3).toString('hex');
};

/**
 * Validate a comment to prevent spam
 * @param comment The comment to validate
 * @returns True if the comment is valid, false otherwise
 */
const validateComment = (comment) => {
  // Check if the comment is too long
  if (comment.length > 50) {
    return false;
  }

  // Check for excessive spaces
  const trimmedComment = comment.replace(/\s+/g, ' ').trim();
  if (trimmedComment.length < 2) {
    return false;
  }

  // Check for spam characters (repeated characters)
  const repeatedChars = /(.)\1{4,}/;
  if (repeatedChars.test(comment)) {
    return false;
  }

  return true;
};

module.exports = {
  generateUniqueId,
  generateRandomPassword,
  validateComment
}; 