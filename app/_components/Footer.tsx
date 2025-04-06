import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Moving Border Gradient Component
const MovingBorderGradient = ({ 
  children, 
  borderWidth = 2,
  gradientColors = ['#8b5cf6', '#ec4899', '#8b5cf6'],
  animationSpeed = 50
}) => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const animateGradient = () => {
      setPosition((prevPosition) => (prevPosition + 1) % 100);
    };
    
    const intervalId = setInterval(animateGradient, animationSpeed);
    return () => clearInterval(intervalId);
  }, [animationSpeed]);

  // Create the gradient color string
  const gradientString = `linear-gradient(90deg, ${gradientColors.join(', ')})`;

  return (
    <div className="relative">
      {/* Gradient border layer */}
      <div 
        className="absolute inset-0 rounded-full"
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
        <div className="relative w-full h-full rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const navLinks = [
    { name: 'About', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const socialLinks = [
    { 
      name: 'Twitter',
      href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
            </svg>
    },
    { 
      name: 'GitHub',
      href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
    },
    { 
      name: 'LinkedIn',
      href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
            </svg>
    },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.4 }}
      className="w-full border-t border-neutral-800 mt-36 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <MovingBorderGradient borderWidth={2} gradientColors={['#8b5cf6', '#ec4899', '#8b5cf6']} animationSpeed={30}>
                <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
              </MovingBorderGradient>
              <span className="text-xl font-bold text-white">SketchByte</span>
            </div>
            <p className="text-neutral-400 mt-3 text-sm max-w-xs">
              Transform your design ideas into reality with our AI-powered design-to-code platform.
            </p>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href}
                  className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Navigation Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-lg">Navigation</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
            <p className="text-neutral-400 text-sm">Subscribe to our newsletter for the latest features and updates.</p>
            <div className="flex mt-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-neutral-900 text-neutral-300 px-4 py-2 text-sm rounded-l-md border border-neutral-800 focus:outline-none focus:border-violet-500 w-full"
              />
              <button className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} SketchByte. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs">
            {legalLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-neutral-500 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;