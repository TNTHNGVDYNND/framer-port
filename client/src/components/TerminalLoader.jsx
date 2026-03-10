import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Barcode from './Barcode';

/**
 * custom hook to manage terminal commands
 */
function useTerminalCommands(initialOutput = []) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState(initialOutput);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    setOutput((prev) => [...prev, `$ ${cmd}`]);

    switch (cmd) {
      case 'status':
        setOutput((prev) => [
          ...prev,
          `Browser: ${navigator.userAgent.split(' ')[0]}`,
          `Resolution: ${window.innerWidth}x${window.innerHeight}`,
          `Time: ${new Date().toLocaleTimeString()}`,
        ]);
        break;
      case 'help':
        setOutput((prev) => [
          ...prev,
          'Available commands: status, help, clear',
        ]);
        break;
      case 'clear':
        setOutput([]);
        break;
      default:
        setOutput((prev) => [
          ...prev,
          'Command not recognized. Type "help" for options.',
        ]);
    }
    setCommand('');
  };

  const clear = () => setOutput([]);

  return { command, setCommand, output, handleCommand, clear };
}

const bootStrings = [
  'System initialization started...',
  'Boot sequence initiated...',
  'Loading core modules...',
  'Mounting file systems...',
  'Establishing secure connection...',
  'Loading user profile...',
  'Initializing display adapter...',
  'Loading animation frameworks...',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const TerminalLoader = ({ onComplete = () => {} }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const { command, setCommand, output, handleCommand } = useTerminalCommands(
    []
  );

  // simulate loading progress
  useEffect(() => {
    let timeoutId = null;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          timeoutId = setTimeout(onComplete, 800);
          return 100;
        }
        const next = prev + 1;
        setPhaseIndex(
          Math.min(
            Math.floor((next / 100) * bootStrings.length),
            bootStrings.length - 1
          )
        );
        return next;
      });
    }, 30);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  const progressBar = Array(30)
    .fill(0)
    .map((_, i) => (i < (progress / 100) * 30 ? '█' : '░'))
    .join('');

  return (
    <motion.div
      className='fixed inset-0 z-100 flex items-center justify-center font-mono text-sm bg-neutral-50'
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
      }}
    >
      <div className='relative w-full max-w-2xl p-8'>
        <div className='rounded-lg overflow-hidden backdrop-blur-sm border border-dusk bg-neutral-50 relative'>
          {/* scanline overlay */}
          <div className='scanlines pointer-events-none absolute inset-0'></div>

          {/* terminal header */}
          <div className='px-4 py-2 flex items-center gap-2 bg-neutral-100 border-b border-dusk'>
            <div className='flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-coral'></div>
              <div className='w-3 h-3 rounded-full bg-dusk'></div>
              <div className='w-3 h-3 rounded-full bg-lagoon'></div>
            </div>
            <span className='ml-4 text-xs text-text-secondary'>
              system_boot.exe
            </span>
          </div>

          {/* terminal body */}
          <div className='p-6 space-y-4 text-text-primary relative z-10'>
            {/* boot‑up lines with Framer Motion stagger */}
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='space-y-1 text-xs text-neutral-500 font-mono'
            >
              {bootStrings.slice(0, phaseIndex + 1).map((line, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <span className='text-lagoon'>$</span> {line}
                </motion.div>
              ))}
            </motion.div>

            {/* command output log */}
            {output.length > 0 && (
              <div className='space-y-1 text-xs text-neutral-500 font-mono'>
                {output.map((ln, idx) => (
                  <div key={idx}>{ln}</div>
                ))}
              </div>
            )}

            {/* input prompt */}
            <div className='flex items-center gap-2'>
              <span className='text-lagoon'>$</span>
              <input
                type='text'
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleCommand}
                className='flex-1 bg-transparent border-none outline-none text-text-primary font-mono text-xs'
                placeholder='try "status" or "help"'
                autoFocus
              />
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className='w-2 h-4 bg-lagoon'
              />
            </div>

            {/* loading phases */}
            <div className='space-y-2 text-xs'>
              {bootStrings.slice(0, phaseIndex + 1).map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    i === phaseIndex ? 'text-lagoon' : 'text-neutral-500'
                  }`}
                >
                  <span className='text-ok-400'>✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>

            {/* progress bar */}
            <div className='space-y-2'>
              <div className='flex justify-between text-xs text-neutral-500'>
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className='font-mono text-xs tracking-wider text-ok-400'>
                [{progressBar}]
              </div>
            </div>
          </div>

          {/* barcode decoration */}
          <motion.div
            className='mt-8 flex justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Barcode
              value='SYSTEM-INIT'
              className='w-48'
              lineColor='var(--color-dusk)'
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

TerminalLoader.propTypes = {
  onComplete: PropTypes.func,
};

export default TerminalLoader;
