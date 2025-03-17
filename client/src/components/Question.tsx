import React from 'react';
import Slider from './Slider';
import '../styles/Question.css';

interface QuestionProps {
  question: string;
  description?: string;
  options?: Record<string, string>;
  onChange?: (value: number) => void;
  defaultValue?: number;
}

const Question: React.FC<QuestionProps> = ({
  question,
  description,
  options,
  onChange,
  defaultValue = 0
}) => {
  const handleSliderChange = (value: number) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="question-container">
      <div className="question-content">
        <h3 className="question-text">{question}</h3>
        {description && (
          <p className="question-description">{description}</p>
        )}
      </div>
      <div className="question-slider">
        <Slider 
          min={-3} 
          max={3} 
          defaultValue={defaultValue} 
          onChange={handleSliderChange}
          options={options} 
        />
      </div>
    </div>
  );
};

export default Question; 