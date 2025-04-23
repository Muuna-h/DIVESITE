import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "wouter";

const ProfilePage = () => {
  const authorData = {
    name: "Alex Morgan",
    title: "Senior Tech Journalist & Web Developer",
    bio: "With over 10 years of experience in tech journalism and web development, I've dedicated my career to exploring emerging technologies while helping businesses establish powerful online presences. My background in computer science and digital media allows me to bridge the gap between technical concepts and accessible content.",
    skills: [
      "Web Development", "Content Strategy", "UX Design", 
      "Technology Research", "Digital Marketing", "SEO"
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        institution: "Stanford University",
        year: "2015"
      },
      {
        degree: "B.A. Digital Media",
        institution: "University of California, Berkeley",
        year: "2013"
      }
    ],
    experience: [
      {
        position: "Senior Tech Journalist",
        company: "Dive Tech",
        period: "2018 - Present",
        description: "Leading tech content strategy, researching emerging technologies, and developing high-quality articles on various tech subjects."
      },
      {
        position: "Web Developer",
        company: "TechSolutions Inc.",
        period: "2015 - 2018",
        description: "Designed and developed custom websites and web applications for clients across various industries."
      },
      {
        position: "Digital Content Specialist",
        company: "Future Media Group",
        period: "2013 - 2015",
        description: "Created technology-focused content and managed digital marketing campaigns for tech companies."
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
        <meta name="description" content={`${authorData.name} is a ${authorData.title} at Dive Tech, specializing in tech journalism and web development.`} />
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
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80" 
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
                className="flex justify-center md:justify-start space-x-4"
              >
                <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors duration-300">
                  <i className="fas fa-envelope text-xl"></i>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {authorData.services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                <div className="p-6">
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
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{service.price}</span>
                    <Link href="/contact" className="bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white px-4 py-2 rounded-lg">
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="font-heading text-2xl font-bold mb-4">
              Need a custom solution?
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Contact me to discuss your project requirements and get a personalized quote.
            </p>
            <Link href="/contact" className="bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg inline-flex items-center">
              Contact Me <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;