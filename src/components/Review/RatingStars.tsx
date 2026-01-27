import React from "react";

interface RatingStarsProps {
  rating?: number | null;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  max = 5,
  size = "md",
}) => {
  if (!rating || rating <= 0) {
    return (
      <span className={`text-gray-400 italic ${sizeMap[size]}`}>
        No ratings yet
      </span>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
      {[...Array(max)].map((_, i) => {
        if (i < fullStars) {
          return <span key={i}>⭐</span>;
        }
        if (i === fullStars && hasHalf) {
          return <span key={i}>⭐</span>;
        }
        return (
          <span key={i} className="text-gray-300">
            ⭐
          </span>
        );
      })}
      <span className="ml-1 font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
