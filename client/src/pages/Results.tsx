import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ShareableCard from '../components/ShareableCard';
import { User } from '../types';

const Results: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const { 
    getUserProfile, 
    verifyPasswordAndGetFeedback, 
    loading, 
    error, 
    clearError, 
    feedback, 
    isAuthenticated 
  } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showShareable, setShowShareable] = useState(false);
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
              <p className="text-center mb-lg">
                Based on {feedback.count} anonymous responses
              </p>

              {error && <ErrorMessage message={error} onClose={clearError} />}

              <div className="ratings-results mb-lg">
                <h2 className="mb-md">Average Ratings</h2>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Reliability</span>
                    <span className="rating-value">{feedback.averageRatings.reliability.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(feedback.averageRatings.reliability / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Trustworthiness</span>
                    <span className="rating-value">{feedback.averageRatings.trustworthiness.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(feedback.averageRatings.trustworthiness / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Honesty</span>
                    <span className="rating-value">{feedback.averageRatings.honesty.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(feedback.averageRatings.honesty / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Intelligence</span>
                    <span className="rating-value">{feedback.averageRatings.intelligence.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(feedback.averageRatings.intelligence / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Fun Factor</span>
                    <span className="rating-value">{feedback.averageRatings.funFactor.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(feedback.averageRatings.funFactor / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="rating-item">
                  <div className="rating-label">
                    <span>Overall</span>
                    <span className="rating-value">{feedback.averageRatings.overall?.toFixed(1)}</span>
                  </div>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${((feedback.averageRatings.overall || 0) / 5) * 100}%` }}
                    ></div>
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