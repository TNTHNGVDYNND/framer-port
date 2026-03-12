import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

import { TerminalHeader, BlinkingCursor } from './primitives';
import { useTerminalOutput } from '../hooks';
import { useProgressSimulation } from '../hooks';

const TerminalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  multiline = false,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className='mb-6'>
      {/* Label as terminal command */}
      <div className='flex items-center gap-2 mb-2 font-mono text-sm'>
        <span className='text-ok-500'>➜</span>
        <span className='uppercase tracking-wider text-text-primary'>
          {label}:
        </span>
        {required && <span className='text-xs text-brand-secondary'>[required]</span>}
      </div>

      {/* Input field container */}
      <div
        className='relative flex items-start gap-2 p-3 rounded border transition-all duration-300'
        style={{
          backgroundColor: 'var(--color-outer-glow)',
          borderColor: isFocused
            ? 'var(--color-brand-primary)'
            : 'var(--color-neutral-700)',
          boxShadow: isFocused ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
        }}
      >
        {/* Terminal prompt */}
        <span className='font-mono text-lg select-none mt-1 text-brand-primary'>
          {'>'}
        </span>

        {/* Input field */}
        <InputComponent
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          rows={multiline ? 5 : undefined}
          className={`flex-1 bg-transparent border-none outline-none font-mono text-sm resize-none text-text-primary ${
            multiline ? 'min-h-25' : ''
          }`}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />

        {/* Blinking cursor */}
        {isFocused && <BlinkingCursor className='w-2 h-5 mt-1 bg-brand-primary' />}
      </div>
    </div>
  );
};

TerminalInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  disabled: PropTypes.bool,
};

const TerminalContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const {
    output: terminalOutput,
    addLine,
    clear: clearTerminal,
  } = useTerminalOutput();
  const {
    progress,
    start: startProgress,
    stop: stopProgress,
    complete: completeProgress,
    reset: resetProgress,
  } = useProgressSimulation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    clearTerminal();
    startProgress();

    // Simulate terminal output
    addLine('$ ./send_message.sh', 'command');
    addLine('[SYSTEM] Initializing transmission protocol...', 'system');

    try {
      // For now, simulate API call since backend isn't ready
      await new Promise((resolve) => setTimeout(resolve, 2500));

      completeProgress();

      addLine('[PROCESSING] Validating data integrity...', 'system');
      addLine('[SUCCESS] Message transmitted successfully!', 'success');
      addLine(
        `
      [INFO] Transmission Details:
      - Sender: ${formData.name}
      - Contact: ${formData.email}
      - Timestamp: ${new Date().toLocaleString()}
      - Status: Delivered
      `,
        'info'
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Clear success message after 8 seconds
      setTimeout(() => {
        setStatus('idle');
        clearTerminal();
        resetProgress();
      }, 8000);
    } catch (error) {
      stopProgress();
      addLine('[ERROR] Transmission failed!', 'error');
      addLine(`[DETAILS] ${error.message}`, 'error');
      setStatus('error');

      setTimeout(() => {
        setStatus('idle');
        clearTerminal();
        resetProgress();
      }, 5000);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      {/* Terminal Window Container */}
      <motion.div
        className='terminal-window bg-outer-glow'
        style={{
          borderColor: 'var(--color-neutral-700)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Terminal Header */}
        <div
          className='terminal-window__header bg-neutral-900'
          style={{
            borderColor: 'var(--color-neutral-800)',
          }}
        >
          <TerminalHeader
            filename={`contact_protocol.exe — ${formData.name || 'guest'}@${
              status === 'submitting'
                ? 'transmitting'
                : status === 'success'
                  ? 'delivered'
                  : 'localhost'
            }`}
          />
        </div>

        {/* Terminal Body */}
        <div className='p-6 md:p-8'>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TerminalInput
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === 'submitting'}
            />

            <TerminalInput
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === 'submitting'}
            />

            <TerminalInput
              label='Message'
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              multiline
              disabled={status === 'submitting'}
            />

            {/* Submit Button */}
            <div className='mt-8'>
              <motion.button
                type='submit'
                disabled={status === 'submitting' || status === 'success'}
                className='w-full py-4 px-6 rounded font-mono text-sm font-bold tracking-wider transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-ring'
                style={{
                  backgroundColor:
                    status === 'success'
                      ? 'var(--color-status-success)'
                      : status === 'error'
                        ? 'var(--color-brand-secondary)'
                        : 'var(--color-brand-primary)',
                  color: 'var(--color-neutral-950)',
                  opacity: status === 'submitting' ? 0.7 : 1,
                }}
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              >
                <span>
                  {status === 'submitting'
                    ? '[TRANSMITTING...]'
                    : status === 'success'
                      ? '[SUCCESS]'
                      : status === 'error'
                        ? '[FAILED]'
                        : '> SEND MESSAGE'}
                </span>
                {status === 'submitting' && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    █
                  </motion.span>
                )}
              </motion.button>
            </div>
          </form>

          {/* Progress Bar (visible during submission) */}
          <AnimatePresence>
            {status === 'submitting' && (
              <motion.div
                className='mt-6'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className='flex justify-between text-xs font-mono mb-2'>
                  <span className='text-text-secondary'>Progress</span>
                  <span className='text-brand-primary'>{progress}%</span>
                </div>
                <div className='h-6 font-mono text-xs flex items-center rounded overflow-hidden bg-neutral-900'>
                  <motion.div
                    className='h-full flex items-center font-mono bg-brand-primary text-neutral-950'
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className='pl-2 whitespace-nowrap'>
                      {Array(Math.ceil(progress / 10))
                        .fill('█')
                        .join('')}
                    </span>
                  </motion.div>
                  <span className='pl-2 font-mono text-neutral-600'>
                    {Array(10 - Math.ceil(progress / 10))
                      .fill('░')
                      .join('')}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Output */}
          <AnimatePresence>
            {terminalOutput.length > 0 && (
              <motion.div
                className='mt-6 p-4 rounded font-mono text-xs border bg-neutral-900 border-neutral-800'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {terminalOutput.map((line, index) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`terminal-output-line terminal-output-line--${line.type}`}
                  >
                    {line.text}
                  </motion.div>
                ))}

                {/* Blinking cursor after last line */}
                <BlinkingCursor
                  className='w-2 h-4 mt-1'
                  style={{
                    backgroundColor:
                      status === 'success'
                        ? 'var(--color-status-success)'
                        : status === 'error'
                          ? 'var(--color-brand-secondary)'
                          : 'var(--color-brand-primary)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Command hint */}
          <div className='mt-6 pt-4 border-t font-mono text-xs border-neutral-800 text-text-secondary'>
            <span className='text-brand-primary'>$</span> Type your message above or
            try commands: <span className='text-brand-accent'>help</span>,{' '}
            <span className='text-brand-accent'>clear</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalContactForm;
