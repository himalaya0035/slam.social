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
        min: 1,
        max: 5,
      },
      trustworthiness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      honesty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      intelligence: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      funFactor: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
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