/**
 * Common animation variants for Framer Motion
 * Used across multiple pages to maintain consistency and reduce duplication
 */

export const pageAnimations = {
  /**
   * Container animation with staggered children
   * Used for animating lists and grids of items
   */
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  /**
   * Individual item animation
   * Used for items within animated containers
   */
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },

  /**
   * Page header animation
   * Used for page titles and headers
   */
  pageHeader: {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },

  /**
   * Fade in animation
   * Used for simple fade-in effects
   */
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } }
  },

  /**
   * Scale and fade animation
   * Used for cards and interactive elements
   */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }
};

/**
 * Common hover animations
 */
export const hoverAnimations = {
  /**
   * Subtle lift effect for cards
   */
  lift: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
    transition: { type: 'spring', stiffness: 300 }
  },

  /**
   * Scale effect for buttons
   */
  scale: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 30 }
  },

  /**
   * Tap effect for interactive elements
   */
  tap: {
    scale: 0.98
  }
};

/**
 * Page transition animations
 */
export const pageTransitions = {
  /**
   * Slide in from bottom
   */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },

  /**
   * Fade in/out
   */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
};
