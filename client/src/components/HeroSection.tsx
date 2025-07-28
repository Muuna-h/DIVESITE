import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { fadeIn, container } from "@/utils/animations";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const handleScroll = () => {
      if (sectionRef.current) {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        
        // Only update scroll if the section is in view
        if (top < window.innerHeight && top + height > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced background with parallax and gradient overlay */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay with enhanced colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-accent/40 dark:from-black/70 dark:via-primary/40 dark:to-accent/30 z-10"></div>
        
        {/* Parallax hero image with improved quality - reduced parallax on mobile */}
        <motion.div
          style={{ 
            y: isMobile ? scrollY * 0.1 : scrollY * 0.3,
            position: 'absolute',
            height: '120%',
            width: '100%',
            top: '-10%'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" 
            alt="Digital technology abstract" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </motion.div>
        
        {/* Circuit pattern overlay - hidden on small mobile */}
        <motion.div
          style={{ 
            y: isMobile ? 0 : scrollY * 0.1,
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: isMobile ? 0.1 : 0.2,
            zIndex: 5
          }}
          className="hidden sm:block"
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <img 
            src="/grid-pattern.svg" 
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </motion.div>
      </div>
      
      {/* Hero content with improved mobile styling */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center text-white relative"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Floating tech element - hidden on mobile */}
        <motion.div 
          className="absolute -top-20 right-1/4 w-24 h-24 lg:w-32 lg:h-32 opacity-30 animate-float hidden lg:block"
          style={{ rotate: scrollY * 0.05 }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="rgba(75, 255, 179, 0.8)" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" stroke="rgba(75, 255, 179, 0.6)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="25" stroke="rgba(75, 255, 179, 0.4)" strokeWidth="1" />
          </svg>
        </motion.div>
        
        <motion.div
          variants={fadeIn("up")}
          className="inline-block mb-3 sm:mb-4 glass-morph py-1.5 px-4 sm:py-2 sm:px-6 rounded-full"
        >
          <span className="text-gradient bg-gradient-to-r from-primary to-accent font-medium text-sm sm:text-base">
            Explore The Future of Technology
          </span>
        </motion.div>
        
        <motion.h1 
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight text-gradient bg-gradient-to-r from-white to-gray-300 drop-shadow-lg leading-tight"
          variants={fadeIn("up")}
        >
          Dive Into Tomorrow's Tech
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-gray-100 px-2"
          variants={fadeIn("up", 0.2)}
        >
          Exploring cutting-edge innovations and advancements shaping our digital future.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          variants={fadeIn("up", 0.4)}
        >
          <Link 
            href="services" 
            className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
          >
            Our Services
          </Link>
          <Link 
            href="categories" 
            className="glass-morph hover:bg-white/30 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-lg transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
          >
            Browse Categories
          </Link>
        </motion.div>
        
        {/* Scroll indicator with enhanced animation - hidden on small mobile */}
        <motion.div 
          className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:block"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <Link href="#featured" className="text-white hover:text-accent transition-colors">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-10 sm:h-10">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
