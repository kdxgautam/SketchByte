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
import StarBorder from "@/components/ui/starBorder";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter";
import { BackgroundLines } from "@/components/ui/backgroundLines";

const FeatureShowcase = () => {
  const words = [
    {
      text: "Transform   ",
    },
    {
      text: "designs",
    },
    {
      text: "into",
    },
    {
      text: " websites",
    },
    {
      text: "instantly.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

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

  return (
    <div className="relative flex justify-center items-center min-h-[100vh] bg-black px-4 pt-14 md:pt-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute top-0 lg:max-w-[50%] md:max-w-[50%] sm:max-w-[60%] px-1"
      >
       
          <TypewriterEffect words={words} />
         
      </motion.div>
      {/* Main content container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl mt-14"
      >
        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 gap-8 mt-20"> {/* Main container always full width on xs */}
          {/* Main showcase always first on extra-small screens */}
          <div className="order-1 sm:hidden"> {/* Only visible on extra small screens */}
            <BackgroundLines>
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
                      "absolute inset-0 rounded-3xl z-[-1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform mt-[-20px]",
                      "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
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

                  <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1]">
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
                          className="mt-6 mb-4 flex justify-center"
                        >
                          <CardItem translateZ="80">
                            <Link href="/dashboard">
                              <button className="w-full sm:w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 bg-white text-black hover:bg-gray-200">
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
            </BackgroundLines>
          </div>

          {/* Feature cards on mobile - always after main showcase */}
          <div className="order-2 sm:hidden grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="w-full">
                {renderFeatureCard(feature, index)}
              </div>
            ))}
          </div>

          {/* Original 3-column desktop layout - hidden on xs screens, visible on sm+ */}
          <div className="hidden sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
            {/* Left column - features */}
            <div className="flex flex-col justify-center items-center md:items-end p-2 space-y-4">
              {renderFeatureCard(features[0], 0)}
              {renderFeatureCard(features[1], 1)}
            </div>
            
            {/* Middle column - showcase */}
            <BackgroundLines>
              <CardContainer className="inter-var">
                <div className="relative group mt-0 sm:mt-24">
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
                      "absolute inset-0 rounded-3xl z-[-1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform mt-[-20px]",
                      "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
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

                  <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1]">
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
                          className="mt-6 mb-4 flex justify-center"
                        >
                          <CardItem translateZ="80">
                            <Link href="/dashboard">
                              <button className="w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 bg-white text-black hover:bg-gray-200">
                                Get Started
                              </button>
                            </Link>
                          </CardItem>
                        </motion.div>
                      </div>
                    </motion.div>
                  </CardBody>
                </div>
              </CardContainer>
            </BackgroundLines>

            {/* Right column - features */}
            <div className="flex flex-col justify-center items-center md:items-start space-y-6">
              {renderFeatureCard(features[2], 2)}
              {renderFeatureCard(features[3], 3)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Animated heading */}
      
    </div>
  );
};

export default FeatureShowcase;