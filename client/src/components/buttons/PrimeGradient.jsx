import React from 'react';
import { useId } from 'react';
import PropTypes from 'prop-types';

const PrimeGradient = ({
  primary = '#FF00FF',
  secondary = '#DC2D62',
  tertiary = '#174DC5',
  outlineFrom = '#FF8C00',
  outlineTo = '#FF4500',
}) => {
  const id = useId();

  return (
    <svg width='0' height='0' className='hidden'>
      <defs>
        {/* Main gradient */}
        <linearGradient
          id={`prime-gradient-${id}`}
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor={primary} />
          <stop offset='50%' stopColor={secondary} />
          <stop offset='100%' stopColor={tertiary} />
        </linearGradient>

        {/* Outline gradient */}
        <linearGradient
          id={`prime-outline-${id}`}
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor={outlineFrom} />
          <stop offset='100%' stopColor={outlineTo} />
        </linearGradient>
      </defs>
    </svg>
  );
};

PrimeGradient.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  tertiary: PropTypes.string,
  outlineFrom: PropTypes.string,
  outlineTo: PropTypes.string,
};

export default PrimeGradient;
