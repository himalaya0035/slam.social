import React, { useRef } from 'react';
import { Ratings } from '../types';

interface ShareableCardProps {
  name: string;
  averageRatings: Ratings;
  topComment?: string;
}

const ShareableCard: React.FC<ShareableCardProps> = ({
  name,
  averageRatings,
  topComment,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="shareable-card" ref={cardRef}>
      <h2 className="gradient-text" data-text={`${name}'s Truth Box Results`}>
        {name}'s Truth Box Results
      </h2>
      <div className="rating">
        {averageRatings.overall?.toFixed(1) || '0.0'}/5.0
      </div>
      {topComment && <div className="quote">"{topComment}"</div>}
      <div className="cta">
        <span className="gradient-text" data-text="Create your own Truth Box">
          Create your own Truth Box at truthbox.app
        </span>
      </div>
    </div>
  );
};

export default ShareableCard; 