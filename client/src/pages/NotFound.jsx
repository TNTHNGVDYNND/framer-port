import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [glitchText, setGlitchText] = useState('404');
  const [typedCommand, setTypedCommand] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Glitch effect for 404
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let interval;

    const startGlitch = () => {
      let count = 0;
      interval = setInterval(() => {
        if (count < 10) {
          setGlitchText(
            '404'
              .split('')
              .map((char) =>
                Math.random() > 0.5
                  ? char
                  : glitchChars[Math.floor(Math.random() * glitchChars.length)]
              )
              .join('')
          );
          count++;
        } else {
          setGlitchText('404');
          clearInterval(interval);
          setTimeout(startGlitch, 3000);
        }
      }, 100);
    };

    startGlitch();
    return () => clearInterval(interval);
  }, []);

  // Easter egg - type "home" to go back
  useEffect(() => {
    const handleKeyPress = (e) => {
      setTypedCommand((prev) => {
        const newCommand = (prev + e.key).slice(-4);
        if (newCommand.toLowerCase() === 'home') {
          window.location.href = '/';
        }
        return newCommand;
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // Show hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const asciiArt = `
    ███████╗██████╗ ██████╗  ██████╗ ██████╗ 
    ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
    █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
    ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
    ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
  `;

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <motion.div
        className='max-w-3xl w-full'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Terminal Window */}
        <div
          className='rounded-lg overflow-hidden border'
          style={{
            backgroundColor: 'var(--color-surface-base)',
            borderColor: 'var(--color-border-default)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div
            className='px-4 py-3 flex items-center gap-2 border-b'
            style={{
              backgroundColor: 'var(--color-surface-base)',
              borderColor: 'var(--color-border-default)',
            }}
          >
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-brand-secondary)' }}
            />
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-brand-accent)' }}
            />
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            />
            <span
              className='ml-4 text-xs font-mono'
              style={{ color: 'var(--color-text-muted)' }}
            >
              error_404.sh
            </span>
          </div>

          {/* Body */}
          <div className='p-8 md:p-12 text-center'>
            {/* Glitching 404 */}
            <motion.div
              className='text-8xl md:text-9xl font-bold font-mono mb-6'
              style={{
                color: 'var(--color-brand-secondary)',
                textShadow: '2px 2px 0px var(--color-brand-primary)',
              }}
              animate={{
                x: [0, -2, 2, -1, 1, 0],
                opacity: [1, 0.8, 1, 0.9, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {glitchText}
            </motion.div>

            {/* ASCII Art */}
            <pre
              className='font-mono text-xs md:text-sm mb-8 hidden md:block'
              style={{ color: 'var(--color-text-muted)' }}
            >
              {asciiArt}
            </pre>

            {/* Error Message */}
            <div className='mb-8'>
              <h1
                className='text-2xl md:text-3xl font-bold font-mono mb-4'
                style={{ color: 'var(--color-text-heading)' }}
              >
                <span style={{ color: 'var(--color-brand-secondary)' }}>
                  [ERROR]
                </span>{' '}
                Page Not Found
              </h1>
              <p
                className='font-mono text-sm max-w-md mx-auto'
                style={{ color: 'var(--color-text-muted)' }}
              >
                The page you are looking for has been deleted, moved, or never
                existed.
              </p>
            </div>

            {/* Terminal Output */}
            <div
              className='p-4 rounded mb-8 font-mono text-sm text-left max-w-lg mx-auto'
              style={{
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <div style={{ color: 'var(--color-brand-primary)' }}>
                $ find /pages/{window.location.pathname.slice(1)}
              </div>
              <div style={{ color: 'var(--color-brand-secondary)' }}>
                find: '/pages/{window.location.pathname.slice(1)}': No such file
                or directory
              </div>
              <div style={{ color: 'var(--color-status-success)' }}>
                ➜ Try navigating back to safety
              </div>
              <div style={{ color: 'var(--color-text-muted)' }}>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  █
                </motion.span>
              </div>
            </div>

            {/* Back Button */}
            <Link to='/'>
              <motion.button
                className='px-8 py-4 rounded font-mono text-sm font-bold tracking-wider border-2 transition-all duration-300'
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-surface-base)',
                  borderColor: 'var(--color-brand-primary)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                $ cd ~<span className='ml-2'>[GO HOME]</span>
              </motion.button>
            </Link>

            {/* Easter Egg Hint */}
            <motion.div
              className='mt-8 font-mono text-xs'
              style={{ color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showHint ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              (Psst... try typing &quot;home&quot; on your keyboard 😉)
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='mt-8 flex justify-center gap-4'>
          {['⬆', '⬆', '⬇', '⬇', '⬅', '➡', '⬅', '➡', 'B', 'A'].map((char, i) => (
            <motion.span
              key={i}
              className='font-mono text-lg'
              style={{ color: 'var(--color-text-muted)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
