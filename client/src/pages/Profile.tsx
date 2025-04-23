import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile - Dive Tech</title>
        <meta name="description" content="Learn about the author of Dive Tech and the web development services offered." />
      </Helmet>
      
      <div className="pt-16 pb-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                <span className="text-primary dark:text-accent">Developer</span> Profile
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Web developer with expertise in creating modern, responsive websites and applications
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 sticky top-20">
                  <div className="text-center mb-6">
                    <div className="w-48 h-48 rounded-full bg-primary/10 dark:bg-accent/10 mx-auto mb-4 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-heading text-2xl font-bold mb-1">John Doe</h2>
                    <p className="text-primary dark:text-accent mb-3">Full Stack Web Developer</p>
                    <div className="flex justify-center space-x-3 mb-4">
                      <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-accent transition-colors">
                        <i className="fab fa-github text-xl"></i>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-accent transition-colors">
                        <i className="fab fa-linkedin text-xl"></i>
                      </a>
                      <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-accent transition-colors">
                        <i className="fab fa-twitter text-xl"></i>
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-primary dark:text-accent w-6"></i>
                      <span className="ml-2">john.doe@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-phone text-primary dark:text-accent w-6"></i>
                      <span className="ml-2">+1 (234) 567-8900</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-primary dark:text-accent w-6"></i>
                      <span className="ml-2">San Francisco, CA</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/contact">
                      <Button className="w-full">
                        <i className="fas fa-paper-plane mr-2"></i> Contact Me
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="space-y-10">
                  <section>
                    <h2 className="font-heading text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                      About Me
                    </h2>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <p>
                        I'm a passionate full-stack web developer with over 8 years of experience in creating responsive, user-friendly websites and applications. My journey in web development began with a curiosity about how websites work, which evolved into a career building digital experiences that help businesses grow.
                      </p>
                      <p>
                        My approach combines technical expertise with a strong focus on user experience and business goals. I believe that great websites not only look good but also deliver results. Whether you need a simple informational site or a complex web application, I'm here to bring your vision to life.
                      </p>
                      <p>
                        When I'm not coding, I enjoy writing tech articles for Dive Tech, exploring emerging technologies, and sharing knowledge with the community.
                      </p>
                    </div>
                  </section>
                  
                  <section id="services">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Services Offered
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <i className="fas fa-shopping-cart text-primary dark:text-accent mr-2"></i>
                            E-Commerce Development
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400">
                            Custom online stores with secure payment integration, inventory management, and user-friendly interfaces to boost your online sales.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <i className="fas fa-blog text-primary dark:text-accent mr-2"></i>
                            Blog & Content Platforms
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400">
                            Professional blog sites with content management systems, SEO optimization, and responsive designs to engage your audience.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <i className="fas fa-briefcase text-primary dark:text-accent mr-2"></i>
                            Business Websites
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400">
                            Corporate websites that effectively communicate your brand, showcase your services, and convert visitors into customers.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <i className="fas fa-mobile-alt text-primary dark:text-accent mr-2"></i>
                            Web Applications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400">
                            Custom web applications and SaaS platforms with modern technology stacks, user authentication, and data management.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>
                  
                  <section>
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Skills & Expertise
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Frontend Development</h3>
                        <div className="space-y-1 text-sm">
                          <div>React / Next.js</div>
                          <div>HTML5 / CSS3 / JavaScript</div>
                          <div>Tailwind CSS / Bootstrap</div>
                          <div>TypeScript</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Backend Development</h3>
                        <div className="space-y-1 text-sm">
                          <div>Node.js / Express</div>
                          <div>Python / Django / Flask</div>
                          <div>RESTful APIs</div>
                          <div>GraphQL</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Database Management</h3>
                        <div className="space-y-1 text-sm">
                          <div>PostgreSQL / MySQL</div>
                          <div>MongoDB</div>
                          <div>Firebase</div>
                          <div>Redis</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">DevOps & Deployment</h3>
                        <div className="space-y-1 text-sm">
                          <div>Git / GitHub</div>
                          <div>Docker</div>
                          <div>AWS / Vercel / Netlify</div>
                          <div>CI/CD Pipelines</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">UI/UX Design</h3>
                        <div className="space-y-1 text-sm">
                          <div>Responsive Design</div>
                          <div>Figma / Adobe XD</div>
                          <div>Accessibility Standards</div>
                          <div>User Experience Best Practices</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Digital Marketing</h3>
                        <div className="space-y-1 text-sm">
                          <div>SEO Optimization</div>
                          <div>Google Analytics</div>
                          <div>Content Strategy</div>
                          <div>Performance Optimization</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>
            
            <div className="bg-primary/5 dark:bg-accent/5 rounded-xl p-8 text-center">
              <h2 className="font-heading text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Let's work together to create a stunning website that meets your needs and exceeds your expectations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get in Touch
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="#services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;