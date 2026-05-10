import React from 'react';

const StarRating = ({ rating, max = 5 }) => (
  <span className="stars">
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={i < rating ? 'star' : 'star-empty'}>★</span>
    ))}
  </span>
);

export default StarRating;
