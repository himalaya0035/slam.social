const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/', (req, res) => {
  return userController.createUser(req, res);
});

// Get user by unique ID
router.get('/:uniqueId', (req, res) => {
  return userController.getUserByUniqueId(req, res);
});

// Authenticate user with password
router.post('/auth', (req, res) => {
  return userController.authUser(req, res);
});

module.exports = router; 