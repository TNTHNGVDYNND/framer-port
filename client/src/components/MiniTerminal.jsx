import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TerminalHeader, BlinkingCursor } from './primitives';
import { useTerminalOutput } from '../hooks';

// Konami code sequence - defined outside component to avoid dependency issues
const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const MiniTerminal = () => {
  const [command, setCommand] = useState('');
  const { output, addLine, addLines, clear: clearOutput } = useTerminalOutput();
  const [konamiIndex, setKonamiIndex] = useState(0);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Command handlers
  const commands = {
    help: () => ({
      type: 'system',
      lines: [
        'Available commands:',
        '',
        '  whoami      - Display user profile',
        '  chef        - View culinary history',
        '  journalist  - View writing background',
        '  skills      - List technical abilities',
        '  clear       - Clear terminal output',
        '  help        - Show this help menu',
      ],
    }),

    whoami: () => ({
      type: 'success',
      lines: [
        '┌─────────────────────────────────────────┐',
        '│  USER PROFILE                           │',
        '├─────────────────────────────────────────┤',
        '│  Name:    Tuanthong Vaidyanond          │',
        '│  Origin:  Bangkok, Thailand            │',
        '│  Current: Nürnberg, Germany              │',
        '│  Role:    Full-Stack Developer (MERN)  │',
        '│  Status:  Seeking opportunities         │',
        '│                                         │',
        '│  Languages: EN | DE | ภาษาไทย          │',
        '│                                         │',
        '│  Philosophy: The Building Blocks        │',
        '│  "Where creativity meets code"           │',
        '└─────────────────────────────────────────┘',
      ],
    }),

    chef: () => ({
      type: 'info',
      lines: [
        '🍳 CULINARY CHAPTER 🍳',
        '',
        '    👨‍🍳',
        '   🍲🍲',
        '  🥘🥘🥘',
        '',
        'Restaurant: Wirtshauskatze',
        'Location:  Nürnberg, Germany',
        'Period:    2015-2023',
        '',
        'From Thai spices to Bavarian cuisine,',
        'mastered the art of bringing flavors together.',
        "Just like coding - it's all about the right ingredients!",
      ],
    }),

    journalist: () => ({
      type: 'info',
      lines: [
        '📰 PRESS CREDENTIALS 📰',
        '',
        'Organization: Siam Sport Syndicate',
        'Role:        Field Journalist',
        'Coverage:    Sports & Cultural Events',
        'Period:      2005-2015',
        '',
        '✓ Covered major sporting events across Thailand',
        '✓ Cultural correspondent assignments in UK',
        '✓ Interviewed athletes, artists, and public figures',
        '',
        '"Every story has a beginning, middle, and end.',
        ' Just like a well-structured codebase."',
      ],
    }),

    skills: () => ({
      type: 'system',
      lines: [
        'TECHNICAL ARSENAL',
        '',
        'FRONTEND:',
        '  React ████████████░░ 85%',
        '  JavaScript █████████████░░░ 90%',
        '  Tailwind CSS ███████████░░░ 80%',
        '  Framer Motion ██████████░░░░ 75%',
        '',
        'BACKEND:',
        '  Node.js ██████████░░░░░ 75%',
        '  Express ██████████░░░░░ 75%',
        '  MongoDB ████████░░░░░░░ 60%',
        '',
        'OVERALL PROFICIENCY: 75%',
      ],
    }),

    clear: () => {
      clearOutput();
      return null;
    },

    // Easter egg - hidden commands
    matrix: () => ({
      type: 'easter',
      lines: [
        '🎮 EASTER EGG UNLOCKED! 🎮',
        '',
        'Wake up, Neo...',
        'The Matrix has you...',
        '',
        'Follow the white rabbit 🐇',
        '',
        '(Try scrolling down for the truth)',
      ],
    }),

    sudo: () => ({
      type: 'error',
      lines: [
        '[ERROR] Permission denied',
        '',
        "Nice try, but you don't have root access here!",
        'This is a portfolio, not a server 😉',
      ],
    }),

    coffee: () => ({
      type: 'info',
      lines: [
        '☕ COFFEE STATUS ☕',
        '',
        'Current level: ████████░░░░ 80%',
        '',
        'Fuel level adequate for coding session.',
        'Remember: "Coffee is the gasoline of life"',
      ],
    }),
  };

  // Handle command execution
  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.toLowerCase().trim();

    if (!trimmedCmd) return;

    // Add command to output
    addLine(`$ ${trimmedCmd}`, 'command');

    // Execute command
    if (commands[trimmedCmd]) {
      const result = commands[trimmedCmd]();
      if (result) {
        setTimeout(() => {
          addLines(result.lines, result.type);
        }, 300);
      }
    } else {
      setTimeout(() => {
        addLine(`Command not found: ${trimmedCmd}`, 'error');
        addLine('Type "help" for available commands', 'system');
      }, 300);
    }
  };

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(command);
    setCommand('');
  };

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      // Check if key matches next in Konami sequence
      if (key === konamiCode[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);

        // If completed Konami code
        if (newIndex === konamiCode.length) {
          addLine('$ ⬆⬆⬇⬇⬅➡⬅➡BA', 'command');
          addLine('🎮 KONAMI CODE ACTIVATED! 🎮', 'easter');
          addLine('You found the secret!', 'easter');
          addLine('Developer mode: ENABLED', 'easter');
          addLine('', 'easter');
          addLine('Fun fact: You just gained 30 extra lives! 🎲', 'easter');
          addLine('(In the game of life, keep pushing forward)', 'easter');
          setKonamiIndex(0);
        }
      } else {
        // Reset if wrong key
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, addLine]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <section className='py-24 px-4 md:px-8'>
      <div className='max-w-3xl mx-auto'>
        {/* Terminal Header */}
        <motion.div
          className='mb-4'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl font-bold font-mono mb-2 text-heading'>
            <span className='text-text-muted mr-2'>$</span>interactive_terminal
          </h2>
          <p className='font-mono text-sm text-text-secondary'>
            <span className='text-status-success'>➜</span> Type a command to explore
            more...
          </p>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          className='terminal-window bg-border-glow'
          style={{
            borderColor: 'var(--color-border-default)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Terminal Header */}
          <div
            className='terminal-window__header py-2 bg-status-success'
            style={{
                borderColor: 'var(--color-border-default)',
            }}
          >
            <TerminalHeader filename='easter_eggs.sh' />
          </div>

          {/* Terminal Body */}
          <div className='p-4'>
            {/* Output Area */}
            <div
              ref={terminalRef}
              className='h-64 overflow-y-auto mb-4 p-4 rounded font-mono text-sm border bg-outer-glow'
              style={{
            borderColor: 'var(--color-border-default)',
              }}
            >
              <AnimatePresence>
                {output.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-text-secondary'
                  >
                    <div className='mb-2'>
                      Welcome to the interactive terminal!
                    </div>
                    <div className='mb-2'>
                      Try typing: <span className='text-brand-primary'>help</span>
                    </div>
                    <div className='text-text-muted'>
                      (Hint: Use ⬆⬆⬇⬇⬅➡⬅➡BA for a surprise)
                    </div>
                  </motion.div>
                ) : (
                  output.map((line, index) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`terminal-output-line terminal-output-line--${line.type}`}
                    >
                      {line.text}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {/* Blinking cursor at end */}
              {output.length > 0 && (
                <BlinkingCursor className='w-2 h-4 mt-1 bg-brand-primary' />
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className='flex items-center gap-2'>
              <span className='font-mono text-lg text-brand-primary'>{'$'}</span>
              <input
                ref={inputRef}
                type='text'
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className='flex-1 bg-outer-glow border-none outline-none font-mono text-sm text-text-primary focus-ring'
                placeholder='Type command...'
                autoFocus
              />
              <BlinkingCursor className='w-2 h-5 bg-brand-primary' />
            </form>
          </div>
        </motion.div>

        {/* Command hint */}
        <div className='mt-4 text-center font-mono text-xs text-text-secondary'>
          Available: <span className='text-brand-accent'>help</span>,{' '}
          <span className='text-brand-accent'>whoami</span>,{' '}
          <span className='text-brand-accent'>chef</span>,{' '}
          <span className='text-brand-accent'>journalist</span>,{' '}
          <span className='text-brand-accent'>skills</span>,{' '}
          <span className='text-brand-accent'>clear</span>
        </div>
      </div>
    </section>
  );
};

export default MiniTerminal;
