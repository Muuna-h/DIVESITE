import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[600px] h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-primary/60 dark:from-black/80 dark:to-primary/40 z-10"></div>
        <motion.div
          style={{ 
            y: scrollY * 0.4,
            position: 'absolute',
            height: '120%',
            width: '100%',
            top: '-10%'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1524146128017-b9dd0bfd2778?auto=format&fit=crop&w=1600&q=80" 
            alt="Futuristic technology" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 z-10 text-center text-white">
        <motion.h1 
          className="font-heading text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dive Into Tomorrow's Tech
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Exploring cutting-edge innovations and advancements shaping our digital future.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="#featured" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
            Explore Articles
          </Link>
          <Link href="#categories" className="bg-transparent hover:bg-white/20 text-white border border-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
            Browse Categories
          </Link>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Link href="#featured" className="text-white/80 hover:text-white">
            <i className="fas fa-chevron-down text-2xl"></i>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
