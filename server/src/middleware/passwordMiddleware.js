const User = require('../models/User');

/**
 * Middleware to verify user password for protected routes
 * This is a more specific authentication for routes that need password verification
 * @param {Object} options - Configuration options
 * @param {string} options.idField - The field in req.params or req.body that contains the user identifier (default: 'userId')
 * @param {string} options.idType - The type of identifier ('id' for MongoDB _id or 'uniqueId' for custom uniqueId)
 * @param {boolean} options.fromBody - Whether to get the password from request body (true) or headers (false)
 */
const verifyPassword = (options = {}) => {
  const {
    idField = 'userId',
    idType = 'id',
    fromBody = false
  } = options;

  return async (req, res, next) => {
    try {
      // Get the user ID from params or body
      const userId = req.params[idField] || req.body[idField];
      
      if (!userId) {
        return res.status(400).json({ message: `${idField} is required` });
      }

      // Get password from body or headers
      let password;
      if (fromBody) {
        password = req.body.password;
      } else {
        // Get password from Authorization header (Basic auth)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Basic ')) {
          const base64Credentials = authHeader.split(' ')[1];
          const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
          password = credentials.split(':')[1]; // Format is "uniqueId:password"
        }
      }

      if (!password) {
        return res.status(401).json({ message: 'Password is required' });
      }

      // Find the user
      let user;
      if (idType === 'id') {
        user = await User.findById(userId);
      } else if (idType === 'uniqueId') {
        user = await User.findOne({ uniqueId: userId });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Password verification error:', error);
      res.status(500).json({ message: 'Server error during password verification' });
    }
  };
};

module.exports = { verifyPassword }; 