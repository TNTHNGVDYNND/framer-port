const ThemeCard = () => {
  const heading = 'Theme System';
  const text = 'Demonstrating the OKLCH color palette used throughout the portfolio.';

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

  const colorNames = [
    'neutral',
    'primary',
    'teal',
    'ok',
    'warn',
    'fail',
    'fuchsia',
    'red',
  ];

  const toneNames = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-dune font-bold mb-4"
            style={{ color: 'var(--color-heading)' }}
          >
            {heading}
          </h1>
          <p 
            className="font-mono max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {text}
          </p>
          <p 
            className="font-mono text-sm mt-2"
            style={{ color: 'var(--color-neutral-400)' }}
          >
            Toggle between light and dark modes to see color transitions
          </p>
        </div>

        {/* Color Grid */}
        <div 
          className="rounded-xl overflow-hidden border"
          style={{ 
            backgroundColor: 'var(--color-card-bg)',
            borderColor: 'var(--color-border-color)'
          }}
        >
          {/* Grid Header */}
          <div 
            className="grid grid-cols-12 gap-1 p-4 border-b"
            style={{ borderColor: 'var(--color-border-color)' }}
          >
            <div 
              className="font-mono text-xs font-bold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Color
            </div>
            {toneNames.map((tone) => (
              <div 
                key={tone}
                className="font-mono text-xs text-center"
                style={{ color: 'var(--color-neutral-400)' }}
              >
                {tone}
              </div>
            ))}
          </div>

          {/* Color Rows */}
          {colorNames.map((colorName) => (
            <div 
              key={colorName}
              className="grid grid-cols-12 gap-1 p-4 border-b last:border-b-0 items-center"
              style={{ borderColor: 'var(--color-border-color)' }}
            >
              <div 
                className="font-mono text-xs font-bold uppercase"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {colorName}
              </div>
              {toneNames.map((tone) => (
                <div
                  key={`${colorName}-${tone}`}
                  className={`${colorMap[colorName][tone]} h-10 rounded transition-all duration-500 hover:scale-110 hover:z-10`}
                  title={`${colorName}-${tone}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div 
          className="mt-8 p-6 rounded-xl border"
          style={{ 
            backgroundColor: 'var(--color-neutral-100)',
            borderColor: 'var(--color-border-color)'
          }}
        >
          <h2 
            className="text-xl font-dune font-bold mb-4"
            style={{ color: 'var(--color-heading)' }}
          >
            About the Color System
          </h2>
          <div 
            className="font-mono text-sm space-y-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <p>
              <span style={{ color: 'var(--color-lagoon)' }}>OKLCH</span> color space is used throughout the portfolio for perceptually uniform colors.
            </p>
            <p>
              Colors automatically adapt between light and dark themes using CSS custom properties.
            </p>
            <p>
              The scale ranges from 50 (lightest) to 950 (darkest), with 500 as the base.
            </p>
          </div>
        </div>

        {/* Current Theme Indicator */}
        <div 
          className="mt-8 text-center font-mono text-xs"
          style={{ color: 'var(--color-neutral-400)' }}
        >
          <span style={{ color: 'var(--color-lagoon)' }}>Tip:</span> Use the theme toggle button in the sidebar to switch between light and dark modes
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
