import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';

interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  options?: Record<string, string>;
}

const Slider: React.FC<SliderProps> = ({
  min = -3,
  max = 3,
  defaultValue = 0,
  onChange,
  options
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Update internal state when defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

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
    // If options are provided, use them
    if (options && options[value.toString()]) {
      return options[value.toString()];
    }
    
    // Fall back to default labels if no options provided
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
  
  // Get min and max labels
  const minLabel = options?.[min.toString()] || "Absolutely not! 🚫";
  const maxLabel = options?.[max.toString()] || "Absolutely! 🎯";

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
          <div 
            className="slider-value-indicator" 
            style={{ 
              left: getValuePosition(),
              opacity: isActive ? 1 : 0.8
            }}
          >
            {getTextLabel(value)}
          </div>
          
          <div className="slider-min-label">{minLabel}</div>
          <div className="slider-max-label">{maxLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default Slider; 