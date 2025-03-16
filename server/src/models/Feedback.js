const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: {
      reliability: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
      intelligence: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
      funFactor: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
      trustworthiness: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
      loyalty: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
      honesty: {
        type: Number,
        required: true,
        min: -3,
        max: 3,
      },
    },
    comment: {
      type: String,
      required: true,
      maxlength: 50,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema); 