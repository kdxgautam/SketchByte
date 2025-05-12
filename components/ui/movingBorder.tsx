import React, { useEffect, useState, ReactNode } from 'react';

interface MovingBorderGradientProps {
  children: ReactNode;
  borderWidth?: number;
  gradientColors?: string[];
  animationSpeed?: number;
}

const MovingBorderGradient = ({ 
  children, 
  borderWidth = 2,
  gradientColors = ['#f0f', '#0ff', '#f0f'],
  animationSpeed = 50
}: MovingBorderGradientProps) => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const animateGradient = () => {
      setPosition((prevPosition) => (prevPosition + 1) % 100);
    };
    
    const intervalId = setInterval(animateGradient, animationSpeed);
    return () => clearInterval(intervalId);
  }, [animationSpeed]);

  const gradientString = `linear-gradient(90deg, ${gradientColors.join(', ')})`;

  return (
    <div className="relative">
      {/* Gradient border layer */}
      <div 
        className="absolute inset-0 rounded-inherit"
        style={{
          background: gradientString,
          backgroundSize: '200% 100%',
          backgroundPosition: `${position}% 0`,
          zIndex: 0,
        }}
      />
      
      {/* Content layer */}
      <div 
        className="relative" 
        style={{ 
          padding: borderWidth,
          zIndex: 1,
        }}
      >
        <div className="relative w-full h-full bg-white rounded-inherit">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MovingBorderGradient;
