import Image from "next/image";
import { motion } from "motion/react";

import Link from "next/link";
import Authentication from "@/app/_components/Authentication";
import { Button } from "@/components/ui/button";
import { auth } from "@/configs/firebaseConfig";
import ProfileAvatar from "@/app/_components/ProfileAvatar";
import { useAuthContext } from "../provider";
import { Cover } from "@/components/ui/cover";






const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center  h-[80vh]">
       
    <h1 className="relative z-10 min mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl text-slate-300">
      {"Launch your website in Hours, not days"
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
            className="mr-2 inline-block my-4"
          >
            {word==="Hours," ? <Cover >Hours,</Cover>:word}
          </motion.span>
        ))}
    </h1>

    <motion.p
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        delay: 0.8,
      }}
      className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400"
    >
      
      With SketchByte, you can convert your sketches into code in seconds,
      revolutionizing your website creation process.
    </motion.p>
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        delay: 1,
      }}
      className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
    >
      <Link href="/dashboard">
      <button  className="w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5  bg-white text-black hover:bg-gray-200">
        Explore Now
      </button>
      </Link>
      <button className="w-60 transform rounded-lg border   px-6 py-2 font-medium  transition-all duration-300 hover:-translate-y-0.5  border-gray-700 bg-black text-white hover:bg-gray-900">
        Contact Support
      </button>
    </motion.div>
    
    
  </div>
  
  )
}
export default Hero