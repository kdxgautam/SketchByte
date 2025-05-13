import React from "react";

// Avoid using TypeScript generics for this component to simplify
interface StarBorderProps {
  // Base props
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: string; // Use string rather than React.CSSProperties to avoid type issues
  // Allow other HTML attributes
  [key: string]: any;
}

const StarBorder = React.forwardRef<HTMLElement, StarBorderProps>(
  ({
    as,
    className = "",
    color = "white",
    speed = "6s",
    children,
    ...rest
  }, ref) => {
    const Component = as || "button";
    
    // Explicitly cast style objects to React.CSSProperties
    const bottomStarStyle: React.CSSProperties = {
      background: `radial-gradient(circle, ${color}, transparent 10%)`,
      animationDuration: speed,
    };
    
    const topStarStyle: React.CSSProperties = {
      background: `radial-gradient(circle, ${color}, transparent 10%)`,
      animationDuration: speed,
    };
    
    return (
      <Component 
        ref={ref}
        className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`} 
        {...rest}
      >
        <div
          className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
          style={bottomStarStyle}
        ></div>
        <div
          className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
          style={topStarStyle}
        ></div>
        <div className="relative z-1 bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
          {children}
        </div>
      </Component>
    );
  }
);

StarBorder.displayName = "StarBorder";

export default StarBorder;