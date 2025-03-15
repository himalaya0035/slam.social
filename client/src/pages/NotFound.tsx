import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-lg">404 - Page Not Found</h1>
          <p className="text-center mb-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 