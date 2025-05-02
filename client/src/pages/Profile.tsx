import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "wouter";
import emmanuelProfile from "../assets/emmanuel_profile.jpg";

const ProfilePage = () => {
  const authorData = {
    name: "Emmanuel Muuna",
    title: "Full Stack Web Developer & IT Manager",
    bio: "I'm a passionate full stack web developer with expertise in creating modern, user-friendly websites and applications. I specialize in frontend development using React and backend integration with Node.js and PostgreSQL. As the IT Manager at Asili Marketplace, I build and manage their website while implementing innovative technology solutions.",
    skills: [
      "Web Development", "React", "Node.js", 
      "UI/UX Design", "Database Management", "RESTful APIs"
    ],
    education: [
      {
        degree: "Bachelor of Microprocessor Technology & Instrumentation",
        institution: "University of Nairobi",
        year: ""
      },
      {
        degree: "Full-Stack Web Development",
        institution: "Tech Bootcamp Academy",
        year: ""
      }
    ],
    experience: [
      {
        position: "IT Manager & Web Developer",
        company: "Asili Marketplace",
        period: "2021 - Present",
        description: "Building and managing the company website, implementing technology solutions, and overseeing IT infrastructure. Leading development of e-commerce and digital marketing strategies."
      },
      {
        position: "Web Developer",
        company: "Dive Tech",
        period: "2022 - Present",
        description: "Developing responsive websites and web applications using modern JavaScript frameworks. Leading frontend development and implementing database solutions."
      },
      {
        position: "Junior Developer",
        company: "Digital Solutions Agency",
        period: "2019 - 2021",
        description: "Created websites for small to medium businesses, implemented e-commerce solutions, and managed client websites."
      }
    ],
    services: [
      {
        title: "E-Commerce Websites",
        description: "Custom online stores with seamless shopping experiences, secure payment processing, and inventory management.",
        features: [
          "Mobile responsive design",
          "Secure payment processing",
          "Inventory management",
          "Customer account portal",
          "SEO optimization"
        ],
        price: "Starting at $2,500"
      },
      {
        title: "Blog Platforms",
        description: "Professional content management systems with responsive design, SEO optimization, and easy content updates.",
        features: [
          "Custom design",
          "Content management system",
          "SEO optimization",
          "Social media integration",
          "Comment management"
        ],
        price: "Starting at $1,800"
      },
      {
        title: "Business Websites",
        description: "Corporate sites that effectively showcase your services, build credibility, and convert visitors to customers.",
        features: [
          "Professional design",
          "Service/product showcases",
          "Contact forms",
          "Analytics integration",
          "Speed optimization"
        ],
        price: "Starting at $2,000"
      },
      {
        title: "Web Applications",
        description: "Custom web apps with user authentication, data management, and modern technology stacks tailored to your needs.",
        features: [
          "User authentication",
          "Database integration",
          "API development",
          "Custom functionality",
          "Ongoing support"
        ],
        price: "Starting at $4,000"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{authorData.name} - Dive Tech</title>
        <meta name="description" content={`${authorData.name} is a ${authorData.title}, specializing in full stack web development and IT management.`} />
      </Helmet>

      {/* Hero section */}
      <section className="bg-gradient-to-br from-gray-900 to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-48 rounded-full overflow-hidden border-4 border-accent/50 shadow-xl"
            >
              <img 
                src={emmanuelProfile} 
                alt={authorData.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="md:ml-8 text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-heading text-4xl md:text-5xl font-bold mb-2"
              >
                {authorData.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl text-accent mb-6"
              >
                {authorData.title}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-6"
              >
                {authorData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-white/10 rounded-full px-4 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center md:justify-start space-x-3"
              >
                <a href="https://wa.me/254757937999" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white hover:text-accent bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <i className="fab fa-whatsapp mr-1.5"></i>
                  <span>WhatsApp</span>
                </a>
                <a href="https://twitter.com/DiveTechBlog" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white hover:text-accent bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <i className="fab fa-twitter mr-1.5"></i>
                  <span>Twitter</span>
                </a>
                <a href="https://github.com/Muuna-h" target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white hover:text-accent bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <i className="fab fa-github mr-1.5"></i>
                  <span>GitHub</span>
                </a>
                <a href="mailto:divetech@gmail.com" 
                   className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white hover:text-accent bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <i className="fas fa-envelope mr-1.5"></i>
                  <span>Email</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-3xl font-bold mb-8 text-center"
            >
              About Me
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-12 leading-relaxed"
            >
              {authorData.bio}
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center">
                  <i className="fas fa-graduation-cap mr-3 text-primary dark:text-accent"></i> Education
                </h3>
                <div className="space-y-6">
                  {authorData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-lg">{edu.degree}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      <p className="text-primary dark:text-accent text-sm">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-heading text-2xl font-bold mb-6 flex items-center">
                  <i className="fas fa-briefcase mr-3 text-primary dark:text-accent"></i> Experience
                </h3>
                <div className="space-y-6">
                  {authorData.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-lg">{exp.position}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                      <p className="text-primary dark:text-accent text-sm mb-2">{exp.period}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl font-bold mb-4 text-center"
          >
            My Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 text-center"
          >
            I offer professional web development services tailored to your specific needs. Each project is built with modern technologies and best practices.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
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
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <i className="fas fa-check text-primary dark:text-accent mt-1 mr-2"></i>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-lg text-primary dark:text-accent">{service.price}</span>
                    <Link href="/contact">
                      <a className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center">
                        Inquire <i className="fas fa-arrow-right ml-1.5"></i>
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
                    Need a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Custom Solution?</span>
            </h3>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
                    Contact me to discuss your project requirements and get a personalized quote. Let's create something amazing together!
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
                        <i className="fab fa-whatsapp mr-2"></i> WhatsApp Me
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
      </section>
    </>
  );
};

export default ProfilePage;