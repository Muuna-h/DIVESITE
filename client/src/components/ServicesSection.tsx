import { motion } from "framer-motion";
import { Link } from "wouter";
import { container, fadeUp, scaleUp } from "@/utils/animations";

const ServicesSection = () => {
  const services = [
    {
      title: "E-Commerce Websites",
      description: "Custom online stores with seamless shopping experiences, secure payment processing, and inventory management.",
      icon: "fa-shopping-cart",
      color: "from-blue-500 to-indigo-600",
      link: "/services#ecommerce"
    },
    {
      title: "Blog Platforms",
      description: "Professional content management systems with responsive design, SEO optimization, and easy content updates.",
      icon: "fa-blog",
      color: "from-green-500 to-teal-500",
      link: "/services#blog"
    },
    {
      title: "Business Websites",
      description: "Corporate sites that effectively showcase your services, build credibility, and convert visitors to customers.",
      icon: "fa-briefcase",
      color: "from-purple-500 to-pink-600",
      link: "/services#business"
    },
    {
      title: "Web Applications",
      description: "Custom web applications tailored to your business needs with modern frameworks and best practices.",
      icon: "fa-laptop-code",
      color: "from-red-500 to-orange-600",
      link: "/services#web-apps"
    }
  ];

  return (
    <motion.section
      className="py-20 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {/* Tech-themed animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Circuit pattern overlay */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0,50 L100,50 M50,0 L50,100 M25,25 L75,75 M75,25 L25,75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="50" r="3" fill="rgba(0,200,255,0.2)" />
                  <circle cx="0" cy="0" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="100" cy="0" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="0" cy="100" r="2" fill="rgba(0,200,255,0.15)" />
                  <circle cx="100" cy="100" r="2" fill="rgba(0,200,255,0.15)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
          {/* Animated glowing dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-teal-400 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-2/4 left-3/4 w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-1/3 left-2/3 w-4 h-4 rounded-full bg-indigo-400 animate-pulse opacity-30" style={{ animationDuration: '6s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          variants={fadeUp}
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Services</span>
          </h2>
          <p className="text-gray-300 text-lg">
            From e-commerce solutions to custom web applications, we provide comprehensive services to help your business thrive online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <motion.div
                className="group relative h-full"
                variants={scaleUp}
              >
                {/* Card with glassmorphism effect */}
                <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 group-hover:border-opacity-30 dark:group-hover:border-opacity-30 transition-all duration-300 shadow-xl"></div>
                
                <div className="relative p-8 h-full flex flex-col">
                  {/* Glowing icon */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${service.color} mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <i className={`fas ${service.icon} text-2xl text-white`}></i>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-teal-400 transition-all duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center text-blue-400 group-hover:text-teal-400 transition-colors duration-300">
                    <span className="mr-2">Learn more</span>
                    <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;