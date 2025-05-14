import { useTheme } from "@/components/ThemeProvider";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";
import { cn } from "@/lib/utils";
import { siteConfig } from "../config";
import { navigateWithScroll } from "@/utils/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

interface HeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const Header = ({ isSearchOpen, setIsSearchOpen }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [_, navigate] = useLocation();

  const { data } = useQuery<{categories: Partial<Category>[]}>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch(`${window.location.origin}/api/categories`);
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      return res.json();
    }
  });

  const categories = data?.categories || [];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithScroll(path, navigate);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md" : "bg-white dark:bg-gray-900"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative group">
            <a href="/" onClick={handleNavigation("/")} className="flex items-center relative px-3 py-2">
              {/* Logo text with the floating animation */}
              <div className="relative z-10 animate-float">
                <span className="font-heading text-2xl font-bold">
                  <span className="text-primary dark:text-accent">
                    {siteConfig.name.split(' ')[0]}
                  </span>
                  <span className="text-accent dark:text-primary">
                    {siteConfig.name.split(' ')[1]}
                  </span>
                </span>
              </div>
              
              {/* Glow effect behind the logo */}
              <div className="absolute -inset-1 rounded-xl z-0 animate-logo-glow blur-xl"></div>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a href="/" onClick={handleNavigation("/")} className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li className="relative group">
                <button className="font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center">
                  Categories <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <a 
                          key={category.id} 
                          href={`/category/${category.slug}`}
                          onClick={handleNavigation(`/category/${category.slug}`)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" 
                          role="menuitem"
                        >
                          {category.name}
                        </a>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-500">Loading...</span>
                    )}
                  </div>
                </div>
              </li>
              <li>
                <a href="/about" onClick={handleNavigation("/about")} className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/services" onClick={handleNavigation("/services")} className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/profile" onClick={handleNavigation("/profile")} className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Profile
                </a>
              </li>
              <li>
                <a href="/contact" onClick={handleNavigation("/contact")} className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          
          {/* Right side utilities */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search button */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={toggleSearch} 
              aria-label="Search"
            >
              <i className="fas fa-search text-gray-600 dark:text-gray-300"></i>
            </button>
            
            {/* Dark mode toggle */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-gray-600 dark:text-gray-300`}></i>
            </button>
            
            {/* User profile */}
            <a href="/profile" onClick={handleNavigation("/profile")} className="p-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center">
                <i className="fas fa-user-circle"></i>
              </div>
            </a>
            
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" onClick={handleNavigation("/")} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Home
              </a>
              <a href="/about" onClick={handleNavigation("/about")} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                About
              </a>
              <a href="/services" onClick={handleNavigation("/services")} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Services
              </a>
              <a href="/contact" onClick={handleNavigation("/contact")} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Contact
              </a>
              <a href="/profile" onClick={handleNavigation("/profile")} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </a>
              <div className="px-3 py-2">
                <div className="font-medium mb-1">Categories</div>
                <div className="pl-2 space-y-1 max-h-40 overflow-y-auto">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <a 
                        key={category.id} 
                        href={`/category/${category.slug}`}
                        onClick={handleNavigation(`/category/${category.slug}`)}
                        className="block py-1 text-sm hover:text-primary dark:hover:text-accent"
                      >
                        {category.name}
                      </a>
                    ))
                  ) : (
                    <span className="block py-1 text-sm text-gray-500">Loading...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search overlay */}
      {isSearchOpen && <SearchOverlay onClose={toggleSearch} />}
    </header>
  );
};

export default Header;