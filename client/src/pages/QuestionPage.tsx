import React, { useState } from 'react';
import Question from '../components/Question';
import '../styles/QuestionPage.css';

const QuestionPage: React.FC = () => {
  const [questionValue, setQuestionValue] = useState<number>(0);

  const handleQuestionChange = (value: number) => {
    setQuestionValue(value);
  };

  // Get text label based on value
  const getTextLabel = (value: number): string => {
    switch (value) {
      case -3:
        return "Absolutely not! 🚫";
      case -2:
        return "No way 🙅";
      case -1:
        return "Not really 😕";
      case 0:
        return "Neutral 😐";
      case 1:
        return "Yes, kinda 👍";
      case 2:
        return "For sure! ✅";
      case 3:
        return "Absolutely! 🎯";
      default:
        return value.toString();
    }
  };

  return (
    <div className="question-page">
      <div className="container">
        <div className="glass-card compact-card">
          <h1 className="text-center">Rate Your Friend</h1>
          <p className="question-page-description text-center">
            Answer honestly - your feedback will help them understand how others perceive them.
          </p>
          
          <div className="questions-container">
            <Question 
              question="How reliable are they when it really matters?"
              description="Will they show up on time, or will you be left reading 'On my way!' for an hour?"
              onChange={handleQuestionChange}
              defaultValue={0}
            />
            
            <div className="response-display">
              <p>Your response: <span className="response-value">{getTextLabel(questionValue)}</span></p>
            </div>
            
            <div className="question-navigation">
              <button className="btn btn-primary">Next Question</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage; 