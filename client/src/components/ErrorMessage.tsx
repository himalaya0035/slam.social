import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message fade-in">
      <div className="error-content">
        <p>{message}</p>
        {onClose && (
          <button className="error-close" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 