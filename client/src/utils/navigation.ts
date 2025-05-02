/**
 * Navigation utility functions for handling smooth scrolling
 * and page navigation behaviors
 */

/**
 * Scrolls the window to the top with smooth behavior
 * Use this when navigating between pages
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
};

/**
 * A wrapper function for handling navigation with scroll to top behavior
 * @param {string} path - The path to navigate to
 * @param {Function} navigate - The navigation function from wouter
 */
export const navigateWithScroll = (path: string, navigate: (to: string) => void) => {
  scrollToTop();
  navigate(path);
}; 