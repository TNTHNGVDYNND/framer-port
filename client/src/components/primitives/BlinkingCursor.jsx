import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Animated blinking block cursor using Framer Motion opacity keyframes.
 *
 * Props:
 *   duration  number  — blink interval in seconds  default: 0.8
 *   className string  — size + colour classes       default: "w-2 h-4 bg-lagoon"
 *   style     object  — inline styles (e.g. dynamic background colour)
 */
const BlinkingCursor = ({
  duration = 0.8,
  className = 'w-2 h-4 bg-brand-primary',
  style,
}) => (
  <motion.span
    className={`inline-block ${className}`}
    style={style}
    animate={{ opacity: [1, 0] }}
    transition={{ duration, repeat: Infinity }}
  />
);

BlinkingCursor.propTypes = {
  duration: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default BlinkingCursor;
