import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { container, fadeUp, scaleUp, scrollTriggerOptions } from "@/utils/animations";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if session exists first to ensure auth is working
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Current session status:", sessionData ? "Active" : "No active session");
      
      // Insert subscriber directly into Supabase
      const { error, data } = await supabase
        .from("subscribers")
        .insert({
          email,
          active: true,
          createdAt: new Date().toISOString(),
        })
        .select();
      
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      console.log("Subscription successful:", data);
      
      toast({
        title: "Success!",
        description: "You've been successfully subscribed to our newsletter.",
      });
      
      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      
      // Provide more specific error messages based on error type
      let errorMessage = "There was an error subscribing to the newsletter. Please try again.";
      
      if (error?.message?.includes("CORS") || error?.message?.includes("NetworkError")) {
        errorMessage = "Network error: Unable to connect to our service. Please check your connection and try again.";
      } else if (error?.code === "23505") { // Unique constraint violation
        errorMessage = "This email is already subscribed to our newsletter.";
      }
      
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section 
      className="py-16 bg-primary dark:bg-primary-dark relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
    >
      {/* Decorative geometric elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-60 h-60 bg-accent/20 rounded-full"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, -7, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 left-1/3 w-80 h-80 bg-accent/20 rounded-full"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center text-white"
          variants={container}
        >
          <motion.h2 
            className="font-heading text-3xl font-bold mb-4"
            variants={fadeUp}
          >
            Stay Updated with Tech Trends
          </motion.h2>
          <motion.p 
            className="text-white/80 mb-8"
            variants={fadeUp}
          >
            Join our newsletter to receive the latest articles, insights, and tech news directly in your inbox.
          </motion.p>
          
          <motion.form 
            className="flex flex-col sm:flex-row gap-3 mb-4" 
            onSubmit={handleSubmit}
            variants={scaleUp}
          >
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-gray-800" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button 
              type="submit" 
              className="bg-accent hover:bg-accent-dark text-primary font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-70"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </motion.button>
          </motion.form>
          
          <motion.p 
            className="text-white/60 text-sm"
            variants={fadeUp}
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default NewsletterSignup;
