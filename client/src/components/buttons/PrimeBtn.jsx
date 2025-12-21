import React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const PrimeBtn = forwardRef(
  (
    {
      as: Component = 'button',
      to,
      href,
      variant = 'solid',
      tone = 'primary',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const Element = Component === Link ? Link : Component;

    return (
      <Element
        ref={ref}
        to={to}
        href={href}
        className={clsx(
          'prime-btn',
          `prime-btn--${variant}`,
          `prime-btn--${tone}`,
          className
        )}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

PrimeBtn.displayName = 'PrimeBtn';

PrimeBtn.propTypes = {
  as: PropTypes.elementType,
  to: PropTypes.string,
  href: PropTypes.string,
  variant: PropTypes.string,
  tone: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default PrimeBtn;
