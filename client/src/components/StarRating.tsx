import React, { useState } from 'react';

interface StarRatingProps {
  name: string;
  label: string;
  value: number;
  onChange: (name: string, value: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  name,
  label,
  value,
  onChange,
  readOnly = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number>(0);

  const handleMouseOver = (index: number) => {
    if (!readOnly) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly) {
      onChange(name, index);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              className={`star ${
                (hoverValue || value) >= starValue ? 'active' : ''
              }`}
              onClick={() => handleClick(starValue)}
              onMouseOver={() => handleMouseOver(starValue)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: readOnly ? 'default' : 'pointer' }}
            >
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating; 