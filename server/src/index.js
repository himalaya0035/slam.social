const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === "production" ? [process.env.CORS_URL_1] : "*";

const corsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/truthbox";
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Default route
app.get('/', (req, res) => {
  const data = {allowedOrigins, a: process.env.NODE_ENV, b: process.env.CORS_URL_1}
  res.send({msg: 'Slam API is running',data});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 