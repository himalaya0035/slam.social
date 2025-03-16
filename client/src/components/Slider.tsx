import React, { useState } from 'react';
import '../styles/Slider.css';

interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  min = -3,
  max = 3,
  defaultValue = 0,
  onChange
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Calculate the position of the value label
  const getValuePosition = () => {
    const range = max - min;
    const percentage = ((value - min) / range) * 100;
    return `calc(${percentage}% - 10px)`;
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
    <div className="slider-container">
      <div className="slider-input-container">
        <div className="slider-track-container">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="slider-input"
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onTouchStart={() => setIsActive(true)}
            onTouchEnd={() => setIsActive(false)}
            onBlur={() => setIsActive(false)}
          />
          {isActive && (
            <div 
              className="slider-value-indicator" 
              style={{ left: getValuePosition() }}
            >
              {getTextLabel(value)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider; 