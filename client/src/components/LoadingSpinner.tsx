import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const spinnerClass = `spinner ${size === 'small' ? 'small' : ''}`;
  
  return (
    <div className={spinnerClass} />
  );
};

export default LoadingSpinner; 