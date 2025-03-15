import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FeedbackSubmission, Ratings, User } from '../types';

const Feedback: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const { getUserProfile, submitUserFeedback, loading, error, clearError } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Ratings>({
    reliability: 0,
    trustworthiness: 0,
    honesty: 0,
    intelligence: 0,
    funFactor: 0,
  });
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (uniqueId) {
        const userData = await getUserProfile(uniqueId);
        if (userData) {
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, [uniqueId, getUserProfile]);

  const handleRatingChange = (name: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uniqueId) return;

    // Check if all ratings are provided
    const allRatingsProvided = Object.values(ratings).every((rating) => rating > 0);
    if (!allRatingsProvided) {
      alert('Please provide ratings for all categories.');
      return;
    }

    // Check if comment is provided
    if (!comment.trim()) {
      alert('Please provide a short feedback comment.');
      return;
    }

    // Check comment length
    if (comment.length > 50) {
      alert('Comment must be 50 characters or less.');
      return;
    }

    const feedbackData: FeedbackSubmission = {
      uniqueId,
      ratings,
      comment: comment.trim(),
    };

    const success = await submitUserFeedback(feedbackData);
    if (success) {
      setSubmitted(true);
    }
  };

  if (loading && !user) {
    return (
      <div className="feedback-container">
        <div className="container">
          <div className="glass-card flex justify-center items-center" style={{ minHeight: '300px' }}>
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="feedback-container">
        <div className="container">
          <div className="glass-card">
            <h1 className="text-center mb-lg">User Not Found</h1>
            <p className="text-center">
              The Truth Box you're looking for doesn't exist. Please check the URL and try again.
            </p>
            <div className="text-center mt-lg">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Create Your Own Truth Box
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="feedback-container">
        <div className="container">
          <div className="glass-card fade-in">
            <h1 className="text-center mb-lg">Thank You!</h1>
            <p className="text-center mb-lg">
              Your feedback has been submitted successfully.
            </p>
            <div className="text-center">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Create Your Own Truth Box
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-md">Rate {user?.name}</h1>
          <p className="text-center mb-lg">
            Your feedback will be anonymous. Be honest but respectful.
          </p>

          {error && <ErrorMessage message={error} onClose={clearError} />}

          <form onSubmit={handleSubmit}>
            <div className="ratings-container">
              <StarRating
                name="reliability"
                label="Reliability"
                value={ratings.reliability}
                onChange={handleRatingChange}
              />
              <StarRating
                name="trustworthiness"
                label="Trustworthiness"
                value={ratings.trustworthiness}
                onChange={handleRatingChange}
              />
              <StarRating
                name="honesty"
                label="Honesty"
                value={ratings.honesty}
                onChange={handleRatingChange}
              />
              <StarRating
                name="intelligence"
                label="Intelligence"
                value={ratings.intelligence}
                onChange={handleRatingChange}
              />
              <StarRating
                name="funFactor"
                label="Fun Factor"
                value={ratings.funFactor}
                onChange={handleRatingChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment" className="form-label">
                Short Feedback (50 chars max)
              </label>
              <textarea
                id="comment"
                className="form-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="E.g., Always has my back, but terrible at texting."
                maxLength={50}
                rows={2}
                required
              />
              <div className="text-right mt-sm">
                <small>{comment.length}/50</small>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Submit Feedback'}
            </button>
          </form>

          <div className="text-center mt-lg">
            <p>
              Want to create your own Truth Box?{' '}
              <a href="/" className="text-primary">
                Click here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 