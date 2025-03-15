import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ErrorMessage from '../components/ErrorMessage';

const Success: React.FC = () => {
  const { user, isAuthenticated, error, clearError } = useAppContext();
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Generate the share URL
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/feedback/${user.uniqueId}`);
  }, [isAuthenticated, user, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewResults = () => {
    navigate(`/results/${user?.uniqueId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-lg">Your Truth Box is Ready!</h1>
          
          {error && <ErrorMessage message={error} onClose={clearError} />}
          
          <div className="text-center mb-lg">
            <p className="mb-md">
              Share this link with your friends to get anonymous feedback:
            </p>
            <div className="share-link-container">
              <input
                type="text"
                className="form-input"
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                className="btn btn-secondary mt-sm"
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
          
          <div className="text-center mb-lg">
            <p className="mb-md">
              Remember, you can only view your results after receiving at least 5 responses.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleViewResults}
            >
              View My Results
            </button>
          </div>
          
          <div className="text-center mt-lg">
            <p>
              Share your Truth Box link on social media to get more responses!
            </p>
            <div className="social-share-buttons mt-md">
              {/* Social share buttons would go here */}
              <button className="btn btn-secondary">
                Share on Instagram
              </button>
              <button className="btn btn-secondary ml-sm">
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success; 