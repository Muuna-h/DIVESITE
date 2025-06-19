import { useLocation } from "wouter";
import { siteConfig } from "../config";
import { navigateWithScroll } from "@/utils/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category } from "@shared/schema";

const Footer = () => {
  const [_, navigate] = useLocation();

  const { data: categories, isLoading, isError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("id", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Custom Link handler with scroll to top functionality
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithScroll(path, navigate);
  };

  return (
    <footer className="bg-white dark:bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-lg font-bold mb-4">About {siteConfig.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A modern tech blog dedicated to exploring emerging technologies and innovations shaping our digital future. We provide tech news, insights, and web development services to help businesses grow online.
            </p>
            <div className="flex space-x-4">
              <a href={siteConfig.socialLinks.twitter} className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-twitter text-xl"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href={siteConfig.socialLinks.github} className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-github text-xl"></i>
                <span className="sr-only">GitHub</span>
              </a>
              <a href={siteConfig.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                <i className="fab fa-whatsapp text-xl"></i>
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {isLoading ? (
                <li>Loading...</li>
              ) : isError ? (
                <li>Error loading categories</li>
              ) : (
                categories?.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`/category/${category.slug}`}
                      onClick={handleNavigation(`/category/${category.slug}`)}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300"
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  E-Commerce Websites
                </a>
              </li>
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Blog Platforms
                </a>
              </li>
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Business Websites
                </a>
              </li>
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Web Applications
                </a>
              </li>
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  View All Services
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" onClick={handleNavigation("/")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" onClick={handleNavigation("/about")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/profile" onClick={handleNavigation("/profile")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Author Profile
                </a>
              </li>
              <li>
                <a href="/contact" onClick={handleNavigation("/contact")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy-policy" onClick={handleNavigation("/privacy-policy")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" onClick={handleNavigation("/terms-and-conditions")} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-300">
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
                <a href={`mailto:${siteConfig.contact.email}`}
                   className="inline-flex items-center justify-center py-1.5 px-3.5 text-xs font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow hover:shadow-md">
                   Email Us
                </a>
              </li>
              <li className="flex items-start">
                <i className="fab fa-whatsapp mt-1 mr-3 text-primary dark:text-accent"></i>
                <a href={siteConfig.contact.phone} 
                   target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center justify-center py-1.5 px-3.5 text-xs font-medium rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 transition-all duration-300 shadow hover:shadow-md">
                   Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary dark:text-accent"></i>
                <span className="text-gray-600 dark:text-gray-400">{siteConfig.contact.address}</span>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} {siteConfig.name} | {siteConfig.domain}. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="/privacy-policy" onClick={handleNavigation("/privacy-policy")} className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300 mr-4">
                Privacy Policy
              </a>
              <a href="/terms-and-conditions" onClick={handleNavigation("/terms-and-conditions")} className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300 mr-4">
                Terms of Service
              </a>
              <a href="/sitemap.xml" onClick={handleNavigation("/sitemap.xml")} className="text-gray-500 dark:text-gray-400 text-sm hover:text-primary dark:hover:text-accent transition-colors duration-300">
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
