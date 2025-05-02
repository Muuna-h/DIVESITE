import { motion } from "framer-motion";
import { Link } from "wouter";
import { container, fadeUp, scaleUp, scrollTriggerOptions } from "@/utils/animations";

const ServicesSection = () => {
  const services = [
    {
      title: "E-Commerce Websites",
      description: "Custom online stores with seamless shopping experiences, secure payment processing, and inventory management.",
      icon: "fa-shopping-cart",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Blog Platforms",
      description: "Professional content management systems with responsive design, SEO optimization, and easy content updates.",
      icon: "fa-blog",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Business Websites",
      description: "Corporate sites that effectively showcase your services, build credibility, and convert visitors to customers.",
      icon: "fa-briefcase",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Web Applications",
      description: "Custom web apps with user authentication, data management, and modern technology stacks tailored to your needs.",
      icon: "fa-laptop-code",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <motion.section 
      id="services" 
      className="py-20 bg-gray-50 dark:bg-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
      variants={container}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={fadeUp}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary dark:text-accent">Web Development</span> Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Custom solutions tailored to your business needs with modern technologies and best practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
              variants={scaleUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <div className="p-6">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-6`}>
                  <i className={`fas ${service.icon} text-xl`}></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <Link href="/profile#services">
                  <a className="text-primary dark:text-accent font-medium hover:underline inline-flex items-center">
                    Learn more <i className="fas fa-arrow-right ml-1 text-sm"></i>
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 relative"
          variants={fadeUp}
        >
          <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden relative z-10">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-r from-teal-400/20 to-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5"></div>
            
            <div className="relative z-10 px-8 py-16 md:py-20 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Project?</span>
          </h3>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Let's work together to create a stunning website that meets your needs and exceeds your expectations.
          </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
                    whileHover={{ translateY: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
                    className="transition-all duration-300"
          >
            <Link href="/contact">
                      <a className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-base py-3 px-8 rounded-full shadow-lg inline-flex items-center justify-center">
                        Get in Touch <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </Link>
          </motion.div>
                  
                  <motion.div
                    whileHover={{ translateY: -5, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="transition-all duration-300"
                  >
                    <a 
                      href="https://wa.me/254757937999" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-medium text-base py-3 px-8 rounded-full shadow-lg inline-flex items-center justify-center"
                    >
                      <i className="fab fa-whatsapp mr-2"></i> WhatsApp Us
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative dots */}
          <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;