import { useTheme } from "@/components/ThemeProvider";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";
import { cn } from "@/lib/utils";
import { siteConfig } from "../config";

interface HeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const Header = ({ isSearchOpen, setIsSearchOpen }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md" : "bg-white dark:bg-gray-900"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-heading text-2xl font-bold text-primary dark:text-accent">
                {siteConfig.name.split(' ')[0]}<span className="text-accent dark:text-primary">{siteConfig.name.split(' ')[1]}</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li className="relative group">
                <button className="font-medium hover:text-primary dark:hover:text-accent transition-colors flex items-center">
                  Categories <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/category/it" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Information Technology</Link>
                    <Link href="/category/software" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Software Development</Link>
                    <Link href="/category/hardware" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Hardware Technology</Link>
                    <Link href="/category/emerging" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Emerging Technologies</Link>
                    <Link href="/category/green" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Green Tech</Link>
                    <Link href="/category/media" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Media & Entertainment</Link>
                    <Link href="/category/communication" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Communication</Link>
                    <Link href="/category/jobs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Tech Jobs</Link>
                    <Link href="/category/reviews" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Product Reviews</Link>
                  </div>
                </div>
              </li>
              <li>
                <Link href="/about" className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/profile" className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-medium hover:text-primary dark:hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Right side utilities */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
              onClick={toggleSearch} 
              aria-label="Search"
            >
              <i className="fas fa-search text-gray-600 dark:text-gray-300"></i>
            </button>
            
            {/* Dark mode toggle */}
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-gray-600 dark:text-gray-300`}></i>
            </button>
            
            {/* User profile */}
            <Link href="/profile">
              <div className="h-8 w-8 rounded-full bg-primary dark:bg-accent text-white flex items-center justify-center">
                <i className="fas fa-user-circle"></i>
              </div>
            </Link>
            
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
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Home
              </Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Contact
              </Link>
              <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </Link>
              <div className="px-3 py-2">
                <div className="font-medium mb-1">Categories</div>
                <div className="pl-2 space-y-1">
                  <Link href="/category/it" className="block py-1 text-sm hover:text-primary dark:hover:text-accent">
                    Information Technology
                  </Link>
                  <Link href="/category/software" className="block py-1 text-sm hover:text-primary dark:hover:text-accent">
                    Software Development
                  </Link>
                  <Link href="/category/hardware" className="block py-1 text-sm hover:text-primary dark:hover:text-accent">
                    Hardware Technology
                  </Link>
                  <Link href="/category/emerging" className="block py-1 text-sm hover:text-primary dark:hover:text-accent">
                    Emerging Technologies
                  </Link>
                  <Link href="/category/green" className="block py-1 text-sm hover:text-primary dark:hover:text-accent">
                    Green Tech
                  </Link>
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
