import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Page transition variants with 3D effects
const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -15,
    scale: 0.95,
    x: -50
  },
  in: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.5
    }
  },
  out: {
    opacity: 0,
    rotateY: 15,
    scale: 0.95,
    x: 50,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Alternative variants for different routes
const slideUpVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  },
  out: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

const fadeScaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  out: {
    opacity: 0,
    scale: 1.1,
    transition: {
      duration: 0.3
    }
  }
};

const PageTransition = ({ children, variant = 'default' }) => {
  const location = useLocation();
  
  const getVariants = () => {
    switch(variant) {
      case 'slideUp':
        return slideUpVariants;
      case 'fadeScale':
        return fadeScaleVariants;
      default:
        return pageVariants;
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="in"
      exit="out"
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        minHeight: '100vh'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
