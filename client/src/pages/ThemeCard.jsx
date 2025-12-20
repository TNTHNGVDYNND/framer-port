import React from 'react';
import { motion } from 'framer-motion';

const ThemeCard = () => {
  const heading = 'Theme Toggle Test';
  const text = 'Testing dark/light theme toggle functionality.';

  const colorMap = {
    neutral: {
      50: 'bg-neutral-50',
      100: 'bg-neutral-100',
      200: 'bg-neutral-200',
      300: 'bg-neutral-300',
      400: 'bg-neutral-400',
      500: 'bg-neutral-500',
      600: 'bg-neutral-600',
      700: 'bg-neutral-700',
      800: 'bg-neutral-800',
      900: 'bg-neutral-900',
      950: 'bg-neutral-950',
    },
    primary: {
      50: 'bg-primary-50',
      100: 'bg-primary-100',
      200: 'bg-primary-200',
      300: 'bg-primary-300',
      400: 'bg-primary-400',
      500: 'bg-primary-500',
      600: 'bg-primary-600',
      700: 'bg-primary-700',
      800: 'bg-primary-800',
      900: 'bg-primary-900',
      950: 'bg-primary-950',
    },
    teal: {
      50: 'bg-teal-50',
      100: 'bg-teal-100',
      200: 'bg-teal-200',
      300: 'bg-teal-300',
      400: 'bg-teal-400',
      500: 'bg-teal-500',
      600: 'bg-teal-600',
      700: 'bg-teal-700',
      800: 'bg-teal-800',
      900: 'bg-teal-900',
      950: 'bg-teal-950',
    },
    ok: {
      50: 'bg-ok-50',
      100: 'bg-ok-100',
      200: 'bg-ok-200',
      300: 'bg-ok-300',
      400: 'bg-ok-400',
      500: 'bg-ok-500',
      600: 'bg-ok-600',
      700: 'bg-ok-700',
      800: 'bg-ok-800',
      900: 'bg-ok-900',
      950: 'bg-ok-950',
    },
    warn: {
      50: 'bg-warn-50',
      100: 'bg-warn-100',
      200: 'bg-warn-200',
      300: 'bg-warn-300',
      400: 'bg-warn-400',
      500: 'bg-warn-500',
      600: 'bg-warn-600',
      700: 'bg-warn-700',
      800: 'bg-warn-800',
      900: 'bg-warn-900',
      950: 'bg-warn-950',
    },
    fail: {
      50: 'bg-fail-50',
      100: 'bg-fail-100',
      200: 'bg-fail-200',
      300: 'bg-fail-300',
      400: 'bg-fail-400',
      500: 'bg-fail-500',
      600: 'bg-fail-600',
      700: 'bg-fail-700',
      800: 'bg-fail-800',
      900: 'bg-fail-900',
      950: 'bg-fail-950',
    },
    fuchsia: {
      50: 'bg-fuchsia-50',
      100: 'bg-fuchsia-100',
      200: 'bg-fuchsia-200',
      300: 'bg-fuchsia-300',
      400: 'bg-fuchsia-400',
      500: 'bg-fuchsia-500',
      600: 'bg-fuchsia-600',
      700: 'bg-fuchsia-700',
      800: 'bg-fuchsia-800',
      900: 'bg-fuchsia-900',
      950: 'bg-fuchsia-950',
    },
    red: {
      50: 'bg-red-50',
      100: 'bg-red-100',
      200: 'bg-red-200',
      300: 'bg-red-300',
      400: 'bg-red-400',
      500: 'bg-red-500',
      600: 'bg-red-600',
      700: 'bg-red-700',
      800: 'bg-red-800',
      900: 'bg-red-900',
      950: 'bg-red-950',
    },
  };

  return (
    <motion.div
      className='flex bg-neutral-50 min-h-screen min-w-full flex-col items-center justify-center absolute inset-0'
      style={{
        backgroundImage: `
      radial-gradient(
        ellipse at top,
        rgba(180, 220, 255, 0.9) 0%,
        rgba(40, 120, 180, 0.8) 35%,
        rgba(10, 40, 80, 0.95) 70%,
        rgba(5, 15, 30, 1) 100%
      )
    `,
      }}
      animate={{
        backgroundPosition: ['50% 0%', '50% 5%', '50% 0%'],
      }}
      transition={{
        duration: 20,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      <motion.div
        className='absolute top-0 left-0 right-0 h-[35%] opacity-20 pointer-events-none'
        style={{
          background: `
      repeating-linear-gradient(
        -12deg,
        rgba(255,255,255,0.25) 0px,
        rgba(255,255,255,0.05) 20px,
        rgba(255,255,255,0.25) 40px
      )
    `,
          filter: 'blur(10px)',
        }}
        animate={{
          x: ['-6%', '6%', '-6%'],
        }}
        transition={{
          duration: 28,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
      <div className='relative z-10 p-8'>
        <article className='relative w-[80%] max-w-md rounded-lg border border-neutral-500 bg-neutral-100 p-4 shadow-2xl shadow-neutral-500 text-neutral-500 transition-colors duration-700'>
          <h1 className='text-2xl font-bold text-primary-500'>{heading}</h1>
          <p className=' py-4'>{text}</p>
          <div className={'grid grid-cols-11 gap-0.5 z-50'}>
            {[
              'neutral',
              'primary',
              'teal',
              'ok',
              'warn',
              'fail',
              'fuchsia',
              'red',
            ].map((color, colorIndex) =>
              [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                '950',
              ].map((tone, toneIndex) => (
                <div
                  key={`key-${colorIndex}-${toneIndex}`}
                  className={`${colorMap[color][tone]} m-0 p-0 h-8 transition-colors duration-1000`}
                ></div>
              ))
            )}
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default ThemeCard;