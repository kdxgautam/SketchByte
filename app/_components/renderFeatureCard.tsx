import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import  StarBorder  from "@/components/ui/starBorder";
import { SparklesCore } from "@/components/ui/sparkles";
import { Cover } from "@/components/ui/cover";
import exp from "constants";




const renderFeatureCard = (feature: any, index: number) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 1, scale: 0.8 }}
        whileHover={{
          scale: 1.09,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
          },
        }}
        transition={{ duration: 0.5, delay: 0.05 + index * 0.1 }}
        className="mx-auto" // Added for centering on mobile
      >
        <StarBorder
          as="button"
          className="bg-slate-900 rounded-2xl shadow-lg w-full sm:w-[300px] cursor-pointer"
          color="cyan"
          speed="5s"
        >
          <div className="h-[150px] p-4"> {/* Added padding for better spacing */}
            <div
              className={`flex justify-center items-center w-12 h-12 mb-4 rounded-xl ${
                feature.iconBgColor
              } ${feature.iconTextColor || "text-white"}`}
            >
              <span className="text-xl">{feature.icon}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-300">
              {feature.title}
            </h3>
            <p className="text-slate-400 text-sm">{feature.description}</p>
          </div>
        </StarBorder>
      </motion.div>
    );
  };

export default renderFeatureCard;
