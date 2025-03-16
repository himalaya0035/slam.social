import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ShareableCard from '../components/ShareableCard';
import { User } from '../types';
import { questions } from '../constants/questions';

const Results: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const { 
    getUserProfile, 
    verifyPasswordAndGetFeedback, 
    loading, 
    error, 
    clearError, 
    feedback,
  } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showShareable, setShowShareable] = useState(false);
  const navigate = useNavigate();

  // Helper function to get text label based on value
  const getTextLabel = (value: number): string => {
    switch (Math.round(value)) {
      case -3:
        return "Absolutely not!";
      case -2:
        return "No way";
      case -1:
        return "Not really";
      case 0:
        return "Neutral";
      case 1:
        return "Yes, kinda";
      case 2:
        return "For sure!";
      case 3:
        return "Absolutely!";
      default:
        return value.toString();
    }
  };

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    if (uniqueId && password) {
      try {
        await verifyPasswordAndGetFeedback(uniqueId, password);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  const handleShareResults = () => {
    setShowShareable(true);
  };

  // Calculate the width percentage for the rating bar based on -3 to 3 scale
  const calculateBarWidth = (value: number) => {
    // Convert from -3 to 3 scale to 0-100%
    return ((value + 3) / 6) * 100;
  };

  if (loading && !user) {
    return (
      <div className="results-container">
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
      <div className="results-container">
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

  // If we have an error and it's about not having enough feedback
  if (error && error.includes('Not enough feedback yet')) {
    return (
      <div className="results-container">
        <div className="container">
          <div className="glass-card results-locked fade-in">
            <h1 className="text-center mb-lg">Results Locked</h1>
            <ErrorMessage message={error} onClose={clearError} />
            <p className="text-center mb-lg">
              Share your Truth Box link with more friends to get feedback!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/success`)}
            >
              Share My Truth Box
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If we have feedback, show the results
  if (feedback) {
    // Find the top comment (for now, just use the first one)
    const topComment = feedback.comments.length > 0 ? feedback.comments[0] : undefined;

    return (
      <div className="results-container">
        <div className="container">
          {showShareable ? (
            <div className="glass-card fade-in">
              <h1 className="text-center mb-lg">Share Your Results</h1>
              <div className="text-center mb-lg">
                <ShareableCard
                  name={user?.name || ''}
                  averageRatings={feedback.averageRatings}
                  topComment={topComment}
                />
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowShareable(false)}
                >
                  Back to Results
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card fade-in">
              <h1 className="text-center mb-md">{user?.name}'s Results</h1>
              <p className="mb-lg">
                Based on {feedback.count} anonymous responses
              </p>

              {error && <ErrorMessage message={error} onClose={clearError} />}

              <div className="ratings-results mb-lg">
                <h2 className="mb-md">Average Ratings</h2>
                
                {questions.map((q) => {
                  const ratingKey = q.id as keyof typeof feedback.averageRatings;
                  const ratingValue = feedback.averageRatings[ratingKey] || 0;
                  
                  return (
                    <div className="rating-item" key={q.id}>
                      <div className="rating-question">
                        <h3>{q.question}</h3>
                        <p className="rating-description">{q.description}</p>
                      </div>
                      <div className="rating-label">
                        <span className="rating-value">{ratingValue.toFixed(1)}</span>
                        <span className="rating-text">{getTextLabel(ratingValue)}</span>
                      </div>
                      <div className="rating-bar-container">
                        <div className="rating-scale">
                          <span>-3</span>
                          <span>-2</span>
                          <span>-1</span>
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                        </div>
                        <div className="rating-bar-wrapper">
                          <div
                            className="rating-bar"
                            style={{ width: `${calculateBarWidth(ratingValue)}%` }}
                          ></div>
                          <div 
                            className="rating-marker"
                            style={{ left: `${calculateBarWidth(ratingValue)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="rating-item overall">
                  <div className="rating-label">
                    <span>Overall</span>
                    <span className="rating-value">{(feedback.averageRatings.overall || 0).toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div className="rating-scale">
                      <span>-3</span>
                      <span>-2</span>
                      <span>-1</span>
                      <span>0</span>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                    </div>
                    <div className="rating-bar-wrapper">
                      <div
                        className="rating-bar"
                        style={{ width: `${calculateBarWidth(feedback.averageRatings.overall || 0)}%` }}
                      ></div>
                      <div 
                        className="rating-marker"
                        style={{ left: `${calculateBarWidth(feedback.averageRatings.overall || 0)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="feedback-comments mb-lg">
                <h2 className="mb-md">Anonymous Comments</h2>
                {feedback.comments.map((comment, index) => (
                  <div key={index} className="feedback-bubble fade-in">
                    "{comment}"
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={handleShareResults}
                >
                  Share My Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If we don't have feedback yet, show the password form
  return (
    <div className="results-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-lg">Enter Password</h1>
          
          {error && <ErrorMessage message={error} onClose={clearError} />}
          
          <p className="text-center mb-lg">
            Please enter your password to view your results.
          </p>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isAuthenticating}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? <LoadingSpinner size="small" /> : 'View Results'}
            </button>
          </form>
          
          <div className="text-center mt-lg">
            <p>
              Don't have a Truth Box yet?{' '}
              <a href="/" className="text-primary">
                Create one now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results; 