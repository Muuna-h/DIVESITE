import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "wouter";

const ServicesPage = () => {
  const services = [
    {
      title: "Simple Website",
      description: "Clean, professional websites with essential pages and features for small businesses and personal brands.",
      features: [
        "Responsive design",
        "5-7 pages (Home, About, Services, Contact, etc.)",
        "Contact form",
        "SEO basics",
        "Social media integration"
      ],
      price: "Starting at Ksh 40,000",
      icon: "fa-globe",
      color: "from-blue-400 to-cyan-500",
      category: "standard"
    },
    {
      title: "E-Commerce Websites",
      description: "Custom online stores with seamless shopping experiences, secure payment processing, and inventory management.",
      features: [
        "Mobile responsive design",
        "Product management",
        "Secure payment integration",
        "Order tracking",
        "Customer accounts",
        "SEO optimization"
      ],
      price: "Starting at Ksh 120,000",
      icon: "fa-shopping-cart",
      color: "from-blue-500 to-indigo-600",
      category: "specialized"
    },
    {
      title: "Business Websites",
      description: "Corporate sites that effectively showcase your services, build credibility, and convert visitors to customers.",
      features: [
        "Professional design",
        "Service/product showcases",
        "Team profiles",
        "Testimonials",
        "Contact forms",
        "Analytics integration"
      ],
      price: "Starting at Ksh 70,000",
      icon: "fa-briefcase",
      color: "from-purple-500 to-pink-600",
      category: "standard"
    },
    {
      title: "Blog Platforms",
      description: "Professional content management systems with responsive design, SEO optimization, and easy content updates.",
      features: [
        "Custom design",
        "Content management system",
        "SEO optimization",
        "Social media integration",
        "Comment management",
        "Analytics integration"
      ],
      price: "Starting at Ksh 60,000",
      icon: "fa-blog",
      color: "from-green-500 to-teal-500",
      category: "standard"
    },
    {
      title: "Web Applications",
      description: "Custom web apps with user authentication, data management, and modern technology stacks tailored to your needs.",
      features: [
        "User authentication",
        "Database integration",
        "API development",
        "Custom functionality",
        "Ongoing support",
        "Deployment setup"
      ],
      price: "Starting at Ksh 200,000",
      icon: "fa-laptop-code",
      color: "from-amber-500 to-orange-600",
      category: "specialized"
    },
    {
      title: "Banking Websites",
      description: "Secure, reliable banking websites with user-friendly interfaces for financial institutions.",
      features: [
        "Enhanced security features",
        "User account management",
        "Secure transaction processing",
        "Financial calculators",
        "Regulatory compliance features",
        "Mobile banking compatibility"
      ],
      price: "Starting at Ksh 320,000",
      icon: "fa-landmark",
      color: "from-blue-700 to-indigo-800",
      category: "specialized"
    },
    {
      title: "Investment/Broker Websites",
      description: "Specialized platforms for investment firms and brokers with real-time data integration.",
      features: [
        "Market data integration",
        "Investment portfolio tracking",
        "Financial charts and analytics",
        "Secure customer accounts",
        "Transaction history",
        "Compliance features"
      ],
      price: "Starting at Ksh 280,000",
      icon: "fa-chart-line",
      color: "from-green-600 to-teal-700",
      category: "specialized"
    },
    {
      title: "Courier/Tracking Websites",
      description: "Logistics websites with real-time tracking capabilities and management systems.",
      features: [
        "Real-time tracking interface",
        "Shipment management",
        "Customer notifications",
        "Admin dashboard",
        "Driver/delivery management",
        "Route optimization"
      ],
      price: "Starting at Ksh 180,000",
      icon: "fa-truck",
      color: "from-yellow-500 to-amber-600",
      category: "specialized"
    },
    {
      title: "Real Estate Websites",
      description: "Property listing and management websites with search functionality and virtual tours.",
      features: [
        "Property listings",
        "Advanced search filters",
        "Virtual tour integration",
        "Agent profiles",
        "Inquiry system",
        "Map integration"
      ],
      price: "Starting at Ksh 150,000",
      icon: "fa-home",
      color: "from-cyan-500 to-blue-600",
      category: "specialized"
    },
    {
      title: "Loan Websites",
      description: "Financial service websites with loan application and management capabilities.",
      features: [
        "Loan calculators",
        "Application forms",
        "Document upload",
        "Application tracking",
        "Repayment schedules",
        "Account management"
      ],
      price: "Starting at Ksh 200,000",
      icon: "fa-hand-holding-usd",
      color: "from-emerald-500 to-green-600",
      category: "specialized"
    },
    {
      title: "Cryptocurrency/BTC Sites",
      description: "Crypto-focused websites with wallet integration and real-time price tracking.",
      features: [
        "Cryptocurrency price tracking",
        "Wallet integration",
        "Transaction history",
        "Security features",
        "Crypto news feed",
        "Mobile compatibility"
      ],
      price: "Starting at Ksh 250,000",
      icon: "fa-bitcoin",
      color: "from-amber-500 to-orange-600",
      category: "specialized"
    },
    {
      title: "Portfolio Websites",
      description: "Showcase your work, skills, and achievements with a professional portfolio website.",
      features: [
        "Project gallery",
        "Resume/CV section",
        "Testimonials",
        "Contact form",
        "Social media integration",
        "Blog option"
      ],
      price: "Starting at Ksh 50,000",
      icon: "fa-id-badge",
      color: "from-purple-400 to-pink-500",
      category: "standard"
    },
    {
      title: "Online Shopping Websites",
      description: "Feature-rich shopping platforms with advanced product filtering and user experiences.",
      features: [
        "Product categories",
        "Advanced filtering",
        "Wishlist functionality",
        "Customer reviews",
        "Multiple payment options",
        "Inventory management"
      ],
      price: "Starting at Ksh 150,000",
      icon: "fa-store",
      color: "from-indigo-500 to-purple-600",
      category: "specialized"
    }
  ];

  const standardServices = services.filter(service => service.category === "standard");
  const specializedServices = services.filter(service => service.category === "specialized");

  return (
    <>
      <Helmet>
        <title>Our Services - Dive Tech</title>
        <meta name="description" content="Explore our comprehensive web development services including e-commerce, business websites, web applications and specialized industry solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>

      <div className="overflow-x-hidden">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary/90 to-accent/90 text-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our <span className="text-accent">Services</span>
              </motion.h1>
              <motion.p 
                className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 px-4 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Custom web development solutions tailored to your business needs, 
                built with modern technologies and best practices.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              >
                <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm sm:text-base py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center">
                  Get in Touch <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                <a href="https://wa.me/254757937999" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-gray-800 hover:bg-gray-100 font-medium text-sm sm:text-base py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center">
                  <i className="fab fa-whatsapp mr-2 text-green-500"></i> Chat on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Standard Services section */}
        <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Standard Web Services
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Our core web development services for businesses of all sizes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {standardServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  <div className="p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4 sm:mb-6`}>
                      <i className={`fas ${service.icon} text-lg sm:text-xl`}></i>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <i className="fas fa-check text-primary dark:text-accent mt-1 mr-2 text-xs sm:text-sm"></i>
                          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
                      <span className="font-bold text-base sm:text-lg text-primary dark:text-accent">{service.price}</span>
                      <Link href="/contact">
                        <a className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-xs sm:text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center w-full sm:w-auto justify-center">
                          Inquire <i className="fas fa-arrow-right ml-1.5"></i>
                        </a>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Services section */}
        <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Specialized Industry Solutions
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Custom web applications tailored for specific industries and business needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {specializedServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  <div className="p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4 sm:mb-6`}>
                      <i className={`fas ${service.icon} text-lg sm:text-xl`}></i>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <i className="fas fa-check text-primary dark:text-accent mt-1 mr-2 text-xs sm:text-sm"></i>
                          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
                      <span className="font-bold text-base sm:text-lg text-primary dark:text-accent">{service.price}</span>
                      <Link href="/contact">
                        <a className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-xs sm:text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center w-full sm:w-auto justify-center">
                          Inquire <i className="fas fa-arrow-right ml-1.5"></i>
                        </a>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process section */}
        <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Our Development Process
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                We follow a structured approach to deliver high-quality websites that meet your business objectives
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "We begin by understanding your business, goals, target audience, and project requirements.",
                  icon: "fa-search",
                  color: "bg-gradient-to-r from-blue-400 to-blue-500"
                },
                {
                  step: "02",
                  title: "Planning & Design",
                  description: "We create wireframes and design mockups that align with your brand and user experience goals.",
                  icon: "fa-pencil-ruler",
                  color: "bg-gradient-to-r from-purple-400 to-purple-600"
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Our team builds your website with clean code, responsive design, and necessary functionality.",
                  icon: "fa-code",
                  color: "bg-gradient-to-r from-teal-400 to-green-500"
                },
                {
                  step: "04",
                  title: "Testing & Launch",
                  description: "We thoroughly test and deploy your website, ensuring everything works perfectly.",
                  icon: "fa-rocket",
                  color: "bg-gradient-to-r from-orange-400 to-orange-500"
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="relative mx-auto mb-4 sm:mb-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${process.color} flex items-center justify-center text-white mx-auto shadow-md`}>
                      <i className={`fas ${process.icon} text-lg sm:text-2xl`}></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm">
                      {process.step}
                    </div>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3">{process.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 sm:py-16 bg-gray-900 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Ready to Start Your Project?
              </motion.h2>
              <motion.p 
                className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-300 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Contact us today for a free consultation and quote. Let's work together to create a stunning website that meets your needs and exceeds your expectations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              >
                <Link href="/contact">
                  <a className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                    Get Started Today
                  </a>
                </Link>
                <a href="https://wa.me/254757937999" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center text-sm sm:text-base">
                  <i className="fab fa-whatsapp mr-2 text-green-500"></i> WhatsApp Us
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;