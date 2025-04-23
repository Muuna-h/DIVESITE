import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-lg font-bold mb-4">About Dive Tech</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A modern tech blog dedicated to exploring emerging technologies and innovations shaping our digital future. We provide tech news, insights, and web development services to help businesses grow online.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-twitter text-xl"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-facebook text-xl"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-instagram text-xl"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-linkedin text-xl"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/ai" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/category/software" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Software Development
                </Link>
              </li>
              <li>
                <Link href="/category/hardware" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Hardware Technology
                </Link>
              </li>
              <li>
                <Link href="/category/emerging" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Emerging Technologies
                </Link>
              </li>
              <li>
                <Link href="/category/green" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Green Tech
                </Link>
              </li>
              <li>
                <Link href="/category/crypto" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Cryptocurrency
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile#services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  E-Commerce Websites
                </Link>
              </li>
              <li>
                <Link href="/profile#services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Blog Platforms
                </Link>
              </li>
              <li>
                <Link href="/profile#services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Business Websites
                </Link>
              </li>
              <li>
                <Link href="/profile#services" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Web Applications
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Custom Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Author Profile
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-primary dark:text-accent"></i>
                <span className="text-gray-600 dark:text-gray-400">contact@divetech.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-primary dark:text-accent"></i>
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary dark:text-accent"></i>
                <span className="text-gray-600 dark:text-gray-400">123 Tech Avenue, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-primary dark:text-accent"></i>
                <span className="text-gray-600 dark:text-gray-400">Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} Dive Tech. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300 mr-4">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300 mr-4">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
