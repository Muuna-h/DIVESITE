import { motion } from "framer-motion";
import { Link } from "wouter";
import { container, fadeUp, scaleUp, scrollTriggerOptions } from "@/utils/animations";

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
      className="py-20 bg-white dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          variants={fadeUp}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our <span className="text-gradient bg-gradient-to-r from-primary to-accent">Services</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            From e-commerce solutions to custom web applications, we provide comprehensive services to help your business thrive online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <motion.div
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-accent transition-all duration-300 cursor-pointer zoom-hover"
                variants={scaleUp}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}>
                  <i className={`fas ${service.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;