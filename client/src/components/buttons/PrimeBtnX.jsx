/*
 * @deprecated - This file is not currently in use
 * It was an early design system primitive button component
 * Preserved for future refactoring reference
 *
 * PrimeBtnX has been superseded by PrimeBtn in ./PrimeBtn.jsx
 */

/* design system primitive button component */
import React from 'react';
import PropTypes from 'prop-types';
import PrimeGradient from './PrimeGradient.jsx';
import { useMemo, useState, useEffect } from 'react';

const PrimeBtnX = ({
  className = '',
  href = null,
  onClick = null,
  children,
  p = 'px-6 py-3',
  white = false,
  variant = 'solid', // Choose "solid" or "outline"
  ariaLabel = '',
  target = '_self', // Default target is "_self", can be "_blank" for opening in a new tab
  rel = 'noopener noreferrer', // Default rel for security reasons when using target="_blank"
}) => {
  const [initialLoad] = useState(true);
  const [animateButton, setAnimateButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateButton(true);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  const isOutline = variant === 'outline';

  // Define common TailwindCSS classes using useMemo for performance optimization
  const baseClasses = useMemo(
    () =>
      `button relative inline-flex items-center justify-center font-dune rounded-full ${p} ${
        white ? 'text-n-1' : 'text-color-17'
      } ${className || ''}`,
    [p, white, className]
  );

  // Define style variants based on the variant prop
  const variantStyles = useMemo(
    () =>
      isOutline
        ? 'border-2 border-border-color text-accent-alt'
        : 'shadow-lg text-text-inverted',
    [isOutline]
  );

  // Define span classes for the button content
  const spanClasses = 'relative z-10';

  // Define common styles for the button using useMemo for performance optimization
  const commonStyles = useMemo(
    () => ({
      background: isOutline ? 'none' : 'url(#prime-btn-gradient)',
      borderImageSource: isOutline ? 'url(#btn-outline)' : 'none',
    }),
    [isOutline]
  );

  // Function to render the button content
  const renderContent = () => (
    <>
      <span
        className={`${spanClasses} drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}
      >
        {children}
      </span>
      <PrimeGradient white={white} outline={isOutline} />
    </>
  );

  // Render an anchor element if href is provided, otherwise render a button element
  return href ? (
    <a
      href={href}
      className={`${baseClasses} ${variantStyles} ${
        initialLoad && animateButton
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-75'
      }`}
      style={commonStyles}
      onClick={onClick}
      aria-label={ariaLabel}
      target={target} // Ensure target is passed to the anchor element
      rel={rel} // Ensure rel is passed to the anchor element
    >
      {renderContent()}
    </a>
  ) : (
    <button
      className={`${baseClasses} ${variantStyles} transition-all duration-2000 ease-[cubic-bezier(0.42, 0, 0.58, 1)] ${
        initialLoad && animateButton
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-75'
      }`}
      onClick={onClick}
      style={commonStyles}
      aria-label={ariaLabel}
    >
      {renderContent()}
    </button>
  );
};

// Define prop types for the PrimeBtn component
PrimeBtn.propTypes = {
  className: PropTypes.string, // Additional CSS classes
  href: PropTypes.string, // URL to navigate to when the button is clicked
  onClick: PropTypes.func, // Click event handler
  children: PropTypes.node.isRequired, // Button content
  p: PropTypes.string, // Padding classes
  white: PropTypes.bool, // Whether the button text should be white
  variant: PropTypes.oneOf(['solid', 'outline']), // Button style variant
  ariaLabel: PropTypes.string, // ARIA label for accessibility
  target: PropTypes.string, // Target attribute for anchor element
  rel: PropTypes.string, // Rel attribute for anchor element
};

export default PrimeBtnX;
