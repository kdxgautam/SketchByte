"use client";

import React from "react";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-card";
import { BackgroundLines } from "@/components/ui/backgroundLines";

export default function InfiniteMovingCardsDemo() {
  return (
    // <BackgroundLines>
    <div className="h-[90vh] w-screen rounded-lg flex flex-col antialiased bg-black items-center justify-center relative overflow-hidden">
      
      <motion.h2 
        initial={{ opacity: 0,scale:0.7 ,y: 10 }}
        whileInView={{ opacity: 1, y: 0,scale:1.1 }}
        transition={{ duration: 0.5 }}
        className="relative flex z-10 mx-auto px-4 mt-16  max-w-4xl text-center text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-slate-300 mb-20"
      >
        What our Customers say
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
         <InfiniteMovingCards
          items={testimonials}
          
          speed="slow"
        />
      </motion.div>
      
    </div>
   
  );
}

const testimonials = [
  {
    quote:
      "SketchByte transformed how I develop websites. I upload a wireframe, and within seconds, I get production-ready code!",
    name: "Alex Johnson",
    title: "Frontend Developer",
  },
  {
    quote:
      "This tool saved me hours of work. The AI-generated code is clean and easy to integrate into my projects!",
    name: "Samantha Lee",
    title: "UI/UX Designer",
  },
  {
    quote:
      "I love how intuitive and fast SketchByte is. It helps me prototype and iterate much faster than before.",
    name: "Michael Roberts",
    title: "Product Manager",
  },
  {
    quote:
      "As a beginner in web development, this platform has been a game-changer for me. It makes coding from wireframes effortless!",
    name: "Emily Davis",
    title: "Aspiring Web Developer",
  },
  {
    quote:
      "The ability to save and revisit previous wireframe conversions is incredibly useful. Highly recommended!",
    name: "Daniel Smith",
    title: "Freelance Web Developer",
  },
];
