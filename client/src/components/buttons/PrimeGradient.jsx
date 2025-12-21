import React from 'react';
import PropTypes from 'prop-types';
const PrimeBtnGradient = ({ white }) => (
  <>
    <svg width={0} height={0} className='hidden'>
      <defs>
        {/* Gradient Definitions */}
        <linearGradient
          id='prime-btn-gradient'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor='#FF00FF' />
          <stop offset='50%' stopColor='#DC2D62' />
          <stop offset='100%' stopColor='#174DC5' />
        </linearGradient>
        <linearGradient id='btn-outline' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor={white ? '#FFFFFF' : '#FF8C00'} />
          <stop offset='100%' stopColor={white ? '#E0E0E0' : '#FF4500'} />
        </linearGradient>

        {/* Polygon Shape Pattern */}
        <pattern
          id='btn-pattern'
          width='10'
          height='10'
          patternUnits='userSpaceOnUse'
        >
          <polygon
            points='0,10 5,0 10,10'
            fill={white ? '#FFFFFF' : 'url(#prime-btn-gradient)'}
          />
        </pattern>
      </defs>
    </svg>
  </>
);

PrimeBtnGradient.propTypes = {
  white: PropTypes.bool,
};

export default PrimeBtnGradient;
