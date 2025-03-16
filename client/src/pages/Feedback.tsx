import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Question from '../components/Question';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FeedbackSubmission, Ratings, User } from '../types';
import { questions } from '../constants/questions';

const Feedback: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const { getUserProfile, submitUserFeedback, loading, error, clearError } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Ratings>({
    reliability: null,
    trustworthiness: null,
    honesty: null,
    intelligence: null,
    funFactor: null,
    loyalty: null
  });
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
    // Remove getUserProfile from the dependency array to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId]);

  const handleSliderChange = (name: string, value: number) => {
    // Store the raw slider value
    setSliderValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Convert to rating and store in ratings
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uniqueId) return;

    // Check if all ratings are provided
    const allRatingsProvided = Object.values(ratings).every((rating) => rating !== null);
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
              The Slam you're looking for doesn't exist. Please check the URL and try again.
            </p>
            <div className="text-center mt-lg">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Create Your Own Slam
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
                Create Your Own Slam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  // Get the current slider value (0 if not answered yet)
  const currentSliderValue = currentQuestion ? (sliderValues[currentQuestion.id] || 0) : 0;
  return (
    <div className="feedback-container">
      <div className="container">
        <div className="glass-card compact-card fade-in">
          <h1 className="text-center mb-md">Rate {user?.name}</h1>
          <p className="mb-lg">
            Your feedback will be anonymous. Be honest but respectful.
          </p>

          {error && <ErrorMessage message={error} onClose={clearError} />}

          {currentQuestionIndex + 1 <= questions.length ? <div className="question-progress">
            <div className="question-progress-bar">
              <div 
                className="question-progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="question-progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div> : null}

          <div className="questions-container">
            {currentQuestion ? (
              <Question 
                question={currentQuestion.question}
                description={currentQuestion.description}
                onChange={(value) => handleSliderChange(currentQuestion.id, value)}
                defaultValue={currentSliderValue}
              />
            ) : null}            
            {currentQuestion && (
              <div className="question-navigation">
                {!isFirstQuestion && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={handlePrevQuestion}
                  >
                    Previous
                  </button>
                )}
                
                {!isLastQuestion ? (
                  <button 
                    className="btn btn-primary ml-md" 
                    onClick={handleNextQuestion}
                    disabled={false}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary ml-md" 
                    onClick={() => {
                      // Show comment form
                      setCurrentQuestionIndex(questions.length);
                    }}
                    disabled={false}
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </div>

          {currentQuestionIndex === questions.length && (
            <form onSubmit={handleSubmit} className="fade-in">
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
          )}

          <div className="text-center mt-lg">
            <p>
              Want to create your own Slam?{' '}
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