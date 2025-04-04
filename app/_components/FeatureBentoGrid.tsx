"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import CountUp from "@/components/ui/CountUp";
import { BackgroundGradient } from "@/components/ui/backgroundGradient";

const FeatureShowcase = () => {
  const features = [
    {
      position: "top-left",
      icon: "🤖",
      iconBgColor: "bg-blue-600",
      title: "Image to HTML CSS",
      description: "AI powered image to website converter",
    },
    {
      position: "bottom-left",
      icon: "🔧",
      iconBgColor: "bg-slate-800",
      iconTextColor: "text-blue-400",
      title: "Layout Editor",
      description: "No-code design and content editor",
    },
    {
      position: "top-right",
      icon: "🎨",
      iconBgColor: "bg-slate-800",
      iconTextColor: "text-blue-400",
      title: "Figma & Adobe XD",
      description: "Convert Figma and Adobe XD to website",
    },
    {
      position: "bottom-right",
      icon: "🚀",
      iconBgColor: "bg-slate-800",
      iconTextColor: "text-blue-400",
      title: "Design Suggestions",
      description: "AI powered UI/UX suggestions",
    },
  ];

  const animate = true;
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  // Helper function to render feature card
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
        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
        className="bg-slate-900 rounded-2xl p-6 shadow-lg w-[18rem] border border-slate-800 cursor-pointer mt-[-20px]"
      >
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
      </motion.div>
    );
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh] bg-black px-4 py-10 md:py-20">
      {/* Orange circle behind showcase - more muted */}
      

      {/* Main content container */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        // animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-8xl  grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left column - features */}
        <div className="flex flex-col justify-center items-end space-y-6">
          {renderFeatureCard(features[0], 0)}
          {renderFeatureCard(features[1], 1)}
        </div>

        <CardContainer className="inter-var">
          <div className="relative group">
            <motion.div
              variants={animate ? variants : undefined}
              initial={animate ? "initial" : undefined}
              animate={animate ? "animate" : undefined}
              transition={
                animate
                  ? {
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }
                  : undefined
              }
              style={{
                backgroundSize: animate ? "200% 200%" : undefined,
              }}
              className={cn(
                "absolute inset-0 rounded-3xl z-[-1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform mt-[-20px]",
                " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
              )}
            />
            <motion.div
              variants={animate ? variants : undefined}
              initial={animate ? "initial" : undefined}
              animate={animate ? "animate" : undefined}
              transition={
                animate
                  ? {
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }
                  : undefined
              }
              style={{
                backgroundSize: animate ? "200% 200%" : undefined,
              }}
              className={cn(
                "absolute inset-0 rounded-3xl z-[-1] will-change-transform mt-[-20px]",
                "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
              )}
            />
            <CardBody className=" relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1] ">
              {/* Middle column - showcase */}
              <motion.div className="flex flex-col items-center mt-[-20px]">
                <div className="bg-slate-900 rounded-3xl shadow-xl p-6 w-full border border-slate-800">
                  <div className="relative">
                    <CardItem translateZ="100" className="w-full mt-4">
                      <Image
                        src="/mainImage.jpg"
                        alt="Feature showcase"
                        width={400}
                        height={600}
                        className="w-full rounded-lg group-hover/card:shadow-xl"
                      />
                    </CardItem>

                    {/* AI badge overlay */}

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <CardItem translateZ="50">
                        <div className="bg-blue-600 text-white p-4 rounded-xl">
                          <span className="text-xl">AI</span>
                        </div>
                      </CardItem>
                    </div>

                    {/* Percentage indicator */}

                    <div className="absolute top-8 right-0">
                      <CardItem translateZ="150">
                        <div className="bg-white rounded-full p-2 text-green-500 text-sm font-bold">
                          <CountUp
                            from={0}
                            to={100}
                            separator=","
                            direction="up"
                            duration={1}
                            className="count-up-text"
                          />
                          %
                        </div>
                      </CardItem>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1 }}
                    className="m-12   flex justify-center "
                  >
                    <CardItem translateZ="80">
                      <Link href="/dashboard">
                        <button className="w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 bg-white text-black hover:bg-gray-200">
                          Available now
                        </button>
                      </Link>
                    </CardItem>
                  </motion.div>
                </div>
              </motion.div>
            </CardBody>
          </div>
        </CardContainer>

        {/* Right column - features */}
        <div className="flex flex-col justify-center space-y-6">
          {renderFeatureCard(features[2], 2)}
          {renderFeatureCard(features[3], 3)}
        </div>
      </motion.div>

      {/* Animated heading - similar to Hero component */}
      <div className="absolute top-8 left-0 right-0">
        <h2 className="relative z-10 mx-auto max-w-3xl text-center text-xl font-bold md:text-2xl lg:text-4xl text-slate-300">
          {"Transform designs into websites instantly"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h2>
      </div>
    </div>
  );
};

export default FeatureShowcase;
