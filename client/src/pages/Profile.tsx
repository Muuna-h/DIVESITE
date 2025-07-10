import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "wouter";
import emmanuelProfile from "../assets/emmanuel_profile.jpg";

const ProfilePage = () => {
  const authorData = {
    name: "Emmanuel Muuna",
    title: "FullStack Web Developer (ReactJS)",
    bio: "I build responsive, fast, and practical web interfaces using ReactJS, Tailwind, and modern tooling. My focus is creating websites and apps that run smoothly, are easy to manage, and connect well with backend systems. I've worked on real client projects and personal platforms, including ecommerce, blogs, and special event sites. I handle everything from layout design to API connections and version control.",
    skills: [
      "ReactJS", "Tailwind CSS", "JavaScript",
      "Supabase", "REST API Integration", "Git & GitHub"
    ],
    education: [
      {
        degree: "BSc. Microprocessor Technology & Instrumentation",
        institution: "University of Nairobi",
        year: "2025"
      },
      {
        degree: "Foundations of Cybersecurity",
        institution: "Google",
        year: "2025"
      }
    ],
    experience: [
      {
        position: "FullStach Developer",
        company: "KUQUZA Ecommerce",
        period: "2024 – Present",
        description: "Built and deployed an ecommerce platform using ReactJS and Supabase. Developed the entire UI, integrated RESTful APIs, and maintained dynamic frontend features like featured products, admin tools, and dashboard metrics.",
        liveUrl: "https://kuquza.co.ke"
      },
      {
        position: "Web Developer",
        company: "Divetech Blog",
        period: "2023 – Present",
        description: "Created a technology blog focused on digital innovation and cybersecurity. Handled site design, SEO setup, sitemap submission, Google indexing, and responsive content structure.",
        liveUrl: "https://divetech.space"
      },
      {
        position: "Wedding Website Developer",
        company: "Private Event Client",
        period: "2024",
        description: "Designed and launched a fully responsive wedding website using ReactJS, with sections for couple bios, event timelines, and RSVP.",
        liveUrl: "https://vanessa-augustinewedding.vercel.app/"
      },
      {
        position: "Senior Developer",
        company: "DiveTech Agency",
        period: "2022 – 2023",
        description: "Worked on websites for small businesses and events. Focused on layout creation, user-friendly design, and clean source code using React."
      }
    ],
    services: [
      {
        title: "E-Commerce Websites",
        description: "Online stores with mobile support, checkout integration, and product tools.",
        features: [
          "Responsive layout",
          "Product management",
          "Payment integration",
          "Order dashboard",
          "SEO basics"
        ],
        price: "Starting at Ksh 120,000"
      },
      {
        title: "Blog Platforms",
        description: "Simple blogs with clean design, easy editing tools, and shareable posts.",
        features: [
          "Admin post manager",
          "Responsive interface",
          "SEO optimization",
          "Social media integration",
          "Comment tools"
        ],
        price: "Starting at Ksh 60,000"
      },
      {
        title: "Business Websites",
        description: "Corporate sites with contact forms, service pages, and polished UI.",
        features: [
          "Custom sections",
          "Team profiles",
          "Speed optimization",
          "Google Maps and reviews",
          "Analytics setup"
        ],
        price: "Starting at Ksh 70,000"
      },
      {
        title: "Web Applications",
        description: "Custom apps with secure login, database functions, and REST API connections.",
        features: [
          "User accounts",
          "Data management",
          "Admin controls",
          "Custom logic",
          "Bug support"
        ],
        price: "Starting at Ksh 200,000"
      },
      {
        title: "Event & Wedding Websites",
        description: "Personalized event pages for sharing info, stories, and RSVPs with guests.",
        features: [
          "Timeline section",
          "Couple bio",
          "Photo gallery",
          "Guest RSVP form",
          "Location map"
        ],
        price: "Starting at Ksh 40,000"
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
                <a href="mailto:divetechspace@gmail.com" 
                   className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium rounded-md text-white hover:text-accent bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <i className="fas fa-envelope mr-1.5"></i>
                  <span>Email</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Projects section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl font-bold mb-4 text-center"
          >
            Live Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 text-center"
          >
            Check out some of my recent projects that are live and running
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">KUQUZA Ecommerce</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Full-featured ecommerce platform built with ReactJS and Supabase
                </p>
                <a 
                  href="https://kuquza.co.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center"
                >
                  See More <i className="fas fa-arrow-right ml-1.5"></i>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white mb-6">
                  <i className="fas fa-blog text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">Divetech Blog</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Technology blog focused on digital innovation and cybersecurity
                </p>
                <a 
                  href="https://divetech.space" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center"
                >
                  See More <i className="fas fa-arrow-right ml-1.5"></i>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <div className="p-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white mb-6">
                  <i className="fas fa-heart text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">Wedding Website</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Responsive wedding website with timelines, bios, and RSVP features
                </p>
                <a 
                  href="https://vanessa-augustinewedding.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center"
                >
                  See More <i className="fas fa-arrow-right ml-1.5"></i>
                </a>
              </div>
            </motion.div>
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
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{exp.description}</p>
                      {exp.liveUrl && (
                        <a 
                          href={exp.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium text-sm py-2 px-4 rounded-full transition-all duration-300 shadow hover:shadow-md inline-flex items-center"
                        >
                          See More <i className="fas fa-arrow-right ml-1.5"></i>
                        </a>
                      )}
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
                title: "E-Commerce Websites",
                description: "Online stores with mobile support, checkout integration, and product tools.",
                features: [
                  "Responsive layout",
                  "Product management",
                  "Payment integration",
                  "Order dashboard",
                  "SEO basics"
                ],
                price: "Starting at Ksh 120,000",
                icon: "fa-shopping-cart",
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Blog Platforms",
                description: "Simple blogs with clean design, easy editing tools, and shareable posts.",
                features: [
                  "Admin post manager",
                  "Responsive interface",
                  "SEO optimization",
                  "Social media integration",
                  "Comment tools"
                ],
                price: "Starting at Ksh 60,000",
                icon: "fa-blog",
                color: "from-green-500 to-teal-500",
              },
              {
                title: "Business Websites",
                description: "Corporate sites with contact forms, service pages, and polished UI.",
                features: [
                  "Custom sections",
                  "Team profiles",
                  "Speed optimization",
                  "Google Maps and reviews",
                  "Analytics setup"
                ],
                price: "Starting at Ksh 70,000",
                icon: "fa-briefcase",
                color: "from-purple-500 to-pink-600",
              },
              {
                title: "Web Applications",
                description: "Custom apps with secure login, database functions, and REST API connections.",
                features: [
                  "User accounts",
                  "Data management",
                  "Admin controls",
                  "Custom logic",
                  "Bug support"
                ],
                price: "Starting at Ksh 200,000",
                icon: "fa-laptop-code",
                color: "from-amber-500 to-orange-600",
              },
              {
                title: "Event & Wedding Websites",
                description: "Personalized event pages for sharing info, stories, and RSVPs with guests.",
                features: [
                  "Timeline section",
                  "Couple bio",
                  "Photo gallery",
                  "Guest RSVP form",
                  "Location map"
                ],
                price: "Starting at Ksh 40,000",
                icon: "fa-heart",
                color: "from-pink-500 to-rose-500",
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