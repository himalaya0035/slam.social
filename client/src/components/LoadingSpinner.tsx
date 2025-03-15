import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '1.5rem';
      case 'large':
        return '3rem';
      default:
        return '2rem';
    }
  };

  return (
    <div
      className="loading-spinner"
      style={{
        width: getSize(),
        height: getSize(),
        border: `3px solid rgba(255, 255, 255, 0.1)`,
        borderTop: `3px solid var(--primary-gradient)`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
      }}
    />
  );
};

export default LoadingSpinner; 