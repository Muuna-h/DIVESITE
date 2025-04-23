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
              <h2 className="font-heading text-2xl font-bold mb-6 text-center">The Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <i className="fas fa-user-circle text-6xl text-primary dark:text-accent"></i>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">Sarah Johnson</h3>
                  <p className="text-primary dark:text-accent font-medium mb-3">Founder & Editor-in-Chief</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Tech journalist with a passion for making complex technologies accessible to everyone.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <i className="fas fa-user-circle text-6xl text-primary dark:text-accent"></i>
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">David Chen</h3>
                  <p className="text-primary dark:text-accent font-medium mb-3">Technical Director</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Software engineer turned tech commentator with expertise in emerging technologies.
                  </p>
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
