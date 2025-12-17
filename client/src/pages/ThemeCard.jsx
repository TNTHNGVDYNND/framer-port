import React from 'react';

const ThemeCard = () => {
  const heading = 'Theme Toggle Test';
  const text =
    'This is a test page for the dark/light theme toggle functionality.';

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
  };

  return (
    <div className='flex min-h-screen min-w-full flex-col items-center justify-center p-4'>
      <article className='relative w-[80%] max-w-md rounded-lg border border-neutral-500 bg-neutral-100 p-8 shadow-2xl text-neutral-900'>
        <h1 className='text-2xl font-bold text-primary-400'>{heading}</h1>
        <p className=' py-8'>{text}</p>
        <div className={'grid grid-cols-11 gap-0.5 z-50'}>
          {['neutral', 'primary', 'ok', 'warn', 'fail'].map(
            (color, colorIndex) =>
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
                  className={`${colorMap[color][tone]} m-0 p-0 h-8`}
                ></div>
              ))
          )}
        </div>
      </article>
    </div>
  );
};

export default ThemeCard;
