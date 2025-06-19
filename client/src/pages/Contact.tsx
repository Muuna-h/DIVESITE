import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert directly into Supabase contact_messages table
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          read: false,
          createdAt: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out to us. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Submission failed",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Dive Tech</title>
        <meta name="description" content="Get in touch with the Dive Tech team. We'd love to hear from you!" />
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
              Contact <span className="text-primary dark:text-accent">Us</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Have a question, suggestion, or want to collaborate? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-secondary dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                  <h2 className="font-heading text-2xl font-bold mb-6">Send us a message</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Partnership">Partnership Opportunity</option>
                        <option value="Content Suggestion">Content Suggestion</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        rows={6} 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-base py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:hover:shadow-lg disabled:hover:translate-y-0"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="font-heading text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <i className="fas fa-envelope text-primary dark:text-accent"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg mb-1">Email Us</h3>
                        <a href="mailto:divetechspace@gmail.com"
                           className="inline-flex items-center justify-center py-2 px-4 mt-1 text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow hover:shadow-md">
                           Send Email
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <i className="fab fa-whatsapp text-primary dark:text-accent"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg mb-1">WhatsApp Us</h3>
                        <a href="https://wa.me/254757937999"
                           target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center justify-center py-2 px-4 mt-1 text-sm font-medium rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 transition-all duration-300 shadow hover:shadow-md">
                           Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <i className="fas fa-map-marker-alt text-primary dark:text-accent"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg mb-1">Our Location</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <i className="fas fa-clock text-primary dark:text-accent"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg mb-1">Office Hours</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Monday - Friday: 9am - 5pm<br />
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-heading font-bold text-lg mb-3">Follow Us</h3>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors">
                          <i className="fab fa-twitter text-xl"></i>
                          <span className="sr-only">Twitter</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors">
                          <i className="fab fa-facebook text-xl"></i>
                          <span className="sr-only">Facebook</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors">
                          <i className="fab fa-instagram text-xl"></i>
                          <span className="sr-only">Instagram</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors">
                          <i className="fab fa-linkedin text-xl"></i>
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
