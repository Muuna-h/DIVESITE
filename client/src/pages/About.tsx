import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Dive Tech</title>
        <meta name="description" content="Learn about Dive Tech, our mission, and the team behind the innovative tech blog." />
      </Helmet>
      
      <div className="pt-16 pb-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="font-heading text-4xl md:text-5xl font-bold mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About <span className="text-primary dark:text-accent">Dive Tech</span>
            </motion.h1>
            
            <motion.div 
              className="bg-secondary dark:bg-gray-800 rounded-xl p-8 mb-12 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-heading text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                At Dive Tech, we're dedicated to exploring the depths of the technological revolution shaping our world. Our mission is to provide insightful, accurate, and accessible content that bridges the gap between complex tech innovations and the broader audience interested in understanding them.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300">
                We believe that technology is for everyone, and our goal is to demystify the latest developments across various tech domains - from cutting-edge software to revolutionary hardware, from emerging technologies to sustainable tech solutions.
              </p>
            </motion.div>
            
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="font-heading text-2xl font-bold mb-6 text-center">The Digital Deep Dive</h2>
              
              <div className="bg-gray-900 dark:bg-black rounded-xl p-8 text-white overflow-hidden relative">
                {/* Animated tech particles */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <div className="absolute h-2 w-2 rounded-full bg-cyan-400 animate-ping" style={{ top: '15%', left: '10%', animationDelay: '0.5s', animationDuration: '4s' }}></div>
                  <div className="absolute h-3 w-3 rounded-full bg-primary animate-ping" style={{ top: '40%', left: '20%', animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-accent animate-ping" style={{ top: '65%', left: '15%', animationDelay: '2s', animationDuration: '5s' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-cyan-400 animate-ping" style={{ top: '20%', right: '15%', animationDelay: '0.7s', animationDuration: '3.2s' }}></div>
                  <div className="absolute h-3 w-3 rounded-full bg-primary animate-ping" style={{ top: '50%', right: '20%', animationDelay: '2.5s', animationDuration: '4.5s' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-accent animate-ping" style={{ top: '75%', right: '10%', animationDelay: '1s', animationDuration: '3.8s' }}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-8 text-center">
                    <motion.div 
                      className="mx-auto w-20 h-20 mb-4 text-accent animate-float animate-pulse-glow rounded-full bg-gray-800/50 p-4"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary to-accent inline-block">Where Tech Meets Imagination</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300">
                      Dive Tech isn't just a blog—it's a <span className="text-primary font-semibold">digital expedition</span> into the unknown. We venture beyond the surface of conventional tech coverage, exploring the uncharted territories where innovation defies expectations.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-800/50 rounded-lg p-5 backdrop-blur-sm border border-gray-700">
                        <h4 className="text-xl font-bold text-accent mb-2">Quantum Curiosity</h4>
                        <p>We approach technology with the curiosity of quantum explorers—embracing the paradoxical nature of innovation that exists in multiple states of possibility.</p>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-lg p-5 backdrop-blur-sm border border-gray-700">
                        <h4 className="text-xl font-bold text-primary mb-2">Digital Alchemy</h4>
                        <p>Our team transmutes complex technical concepts into golden insights, making the seemingly impossible accessible to everyone.</p>
                      </div>
                    </div>
                    
                    <div className="italic text-gray-400 border-l-4 border-accent pl-4 my-6">
                      "Technology is the campfire around which we tell our stories." <br />
                      <span className="text-sm">— The Dive Tech Manifesto</span>
                    </div>
                    
                    <p className="text-lg text-gray-300">
                      With every article, video, and interactive experience, we're building a <span className="text-accent font-semibold">digital ecosystem</span> where technology isn't just understood—it's felt, questioned, and reimagined.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="font-heading text-2xl font-bold mb-4">Our Commitment</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <i className="fas fa-check-circle text-primary dark:text-accent"></i>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Quality:</strong> We commit to delivering thoroughly researched, accurate, and insightful content.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <i className="fas fa-check-circle text-primary dark:text-accent"></i>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Accessibility:</strong> We make complex technological topics understandable to readers of all backgrounds.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <i className="fas fa-check-circle text-primary dark:text-accent"></i>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Community:</strong> We foster a community of tech enthusiasts who can learn, discuss, and grow together.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <i className="fas fa-check-circle text-primary dark:text-accent"></i>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Future-focused:</strong> We keep our eyes on the horizon, highlighting technologies that will shape tomorrow.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
