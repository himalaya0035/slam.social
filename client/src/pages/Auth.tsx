import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Auth: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const { authenticateWithPassword, loading, error, clearError } = useAppContext();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uniqueId || !password.trim()) {
      return;
    }
    
    const success = await authenticateWithPassword(uniqueId, password.trim());
    
    if (success) {
      navigate(`/results/${uniqueId}`);
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-lg">Enter Password</h1>
          
          {error && <ErrorMessage message={error} onClose={clearError} />}
          
          <p className="text-center mb-lg">
            Please enter your password to view your Slam results.
          </p>
          
          <form onSubmit={handleSubmit}>
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
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'View Results'}
            </button>
          </form>
          
          <div className="text-center mt-lg">
            <p>
              Don't have a Slam yet?{' '}
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

export default Auth; 