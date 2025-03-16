import React, { useState } from 'react';
import Slider from '../components/Slider';
import '../styles/SliderPage.css';

const SliderPage: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
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
    <div className="slider-page">
      <div className="slider-page-container">
        <h1>Slider Demo</h1>
        <p className="slider-description">
          This is a custom range slider that goes from -3 to 3, with text labels instead of numbers.
        </p>
        
        <div className="slider-demo-container">
          <Slider 
            min={-3} 
            max={3} 
            defaultValue={0} 
            onChange={handleSliderChange} 
          />
        </div>
        
        <div className="slider-value-display">
          <p>Current selection: <span className="value-highlight">{getTextLabel(sliderValue)}</span></p>
          <p className="numeric-value">(Value: {sliderValue})</p>
        </div>
      </div>
    </div>
  );
};

export default SliderPage; 