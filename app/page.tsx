"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Navbar from "./_components/Navbar";
import Link from "next/link";
import Authentication from "./_components/Authentication";
import { Button } from "@/components/ui/button";
import { auth } from "@/configs/firebaseConfig";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";
import ClickSpark from "@/components/ui/clickSpark";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import  Features  from "./_components/Features";
import { TestContext } from "node:test";
import Testimonial from "./_components/Testimonial";
import { BackgroundLines } from "@/components/ui/backgroundLines";

function HeroSectionOne() {
  return (
    <div className="relative bg-black flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <Navbar />
        {/* <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div> */}
      <CardSpotlight>
        <Hero/>
       
        </CardSpotlight>


        

        
        
        <Features/>
        
       
        <Testimonial/>
        
        
        {/* Footer Section */}
        <Footer/>
      
      </ClickSpark>
    </div>
  );
}

export default HeroSectionOne;

