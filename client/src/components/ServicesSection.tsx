import { motion } from "framer-motion";
import { Link } from "wouter";

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
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
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
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="font-heading text-2xl font-bold mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Let's work together to create a stunning website that meets your needs and exceeds your expectations.
          </p>
          <Link href="/contact">
            <a className="bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg inline-flex items-center">
              Get in Touch <i className="fas fa-chevron-right ml-2"></i>
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;