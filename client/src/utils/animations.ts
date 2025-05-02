import { Variants } from "framer-motion";

// Fade up animation for individual elements
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Fade in animation with configurable direction
export const fadeIn = (direction: "up" | "down" | "left" | "right" = "up", delay: number = 0): Variants => {
  return {
    hidden: { 
      opacity: 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0
    },
    visible: { 
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay
      }
    }
  };
};

// Container for staggered animations
export const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Scale animation
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.3 }
};

// Animated list item
export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Page transition
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Custom scroll trigger options
export const scrollTriggerOptions = {
  once: false,
  amount: 0.2
}; 