import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const { createNewUser, loading, error, clearError } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    const userData = await createNewUser(name.trim());
    
    if (userData) {
      // Show the password to the user
      alert(`Your password to view results: ${userData.password}\nPlease save this password!`);
      
      // Navigate to the success page
      navigate('/success');
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="glass-card fade-in">
          <h1 className="text-center mb-lg">Truth Box</h1>
          <p className="text-center mb-lg">
            Get anonymous feedback from your friends. Create your Truth Box link and share it with others.
          </p>
          
          {error && <ErrorMessage message={error} onClose={clearError} />}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Create Your Truth Box'}
            </button>
          </form>
          
          <div className="mt-lg text-center">
            <p>No signup required. Just enter your name and get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 