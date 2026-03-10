import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

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
        <span style={{ color: 'var(--color-ok-500)' }}>➜</span>
        <span
          className='uppercase tracking-wider'
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}:
        </span>
        {required && (
          <span className='text-xs' style={{ color: 'var(--color-coral)' }}>
            [required]
          </span>
        )}
      </div>

      {/* Input field container */}
      <div
        className='relative flex items-start gap-2 p-3 rounded border transition-all duration-300'
        style={{
          backgroundColor: 'var(--color-outer-glow)',
          borderColor: isFocused
            ? 'var(--color-lagoon)'
            : 'var(--color-neutral-700)',
          boxShadow: isFocused ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
        }}
      >
        {/* Terminal prompt */}
        <span
          className='font-mono text-lg select-none mt-1'
          style={{ color: 'var(--color-lagoon)' }}
        >
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
          className={`flex-1 bg-transparent border-none outline-none font-mono text-sm resize-none ${
            multiline ? 'min-h-25' : ''
          }`}
          style={{
            color: 'var(--color-text-primary)',
          }}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />

        {/* Blinking cursor */}
        {isFocused && (
          <motion.span
            className='w-2 h-5 mt-1'
            style={{ backgroundColor: 'var(--color-lagoon)' }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
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
  const [progress, setProgress] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addOutput = (line, type = 'info') => {
    setTerminalOutput((prev) => [
      ...prev,
      { text: line, type, id: Date.now() },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setProgress(0);
    setTerminalOutput([]);

    // Simulate terminal output
    addOutput('$ ./send_message.sh', 'command');
    addOutput('[SYSTEM] Initializing transmission protocol...', 'system');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // For now, simulate API call since backend isn't ready
      await new Promise((resolve) => setTimeout(resolve, 2500));

      clearInterval(progressInterval);
      setProgress(100);

      addOutput('[PROCESSING] Validating data integrity...', 'system');
      addOutput('[SUCCESS] Message transmitted successfully!', 'success');
      addOutput(
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
        setTerminalOutput([]);
        setProgress(0);
      }, 8000);
    } catch (error) {
      clearInterval(progressInterval);
      addOutput('[ERROR] Transmission failed!', 'error');
      addOutput(`[DETAILS] ${error.message}`, 'error');
      setStatus('error');

      setTimeout(() => {
        setStatus('idle');
        setTerminalOutput([]);
        setProgress(0);
      }, 5000);
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'command':
        return 'var(--color-lagoon)';
      case 'system':
        return 'var(--color-ok-400)';
      case 'success':
        return 'var(--color-ok-400)';
      case 'error':
        return 'var(--color-coral)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      {/* Terminal Window Container */}
      <motion.div
        className='rounded-lg overflow-hidden border'
        style={{
          backgroundColor: 'var(--color-outer-glow)',
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
          className='px-4 py-3 flex items-center gap-2 border-b'
          style={{
            backgroundColor: 'var(--color-neutral-900)',
            borderColor: 'var(--color-neutral-800)',
          }}
        >
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: 'var(--color-coral)' }}
          />
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: 'var(--color-dusk)' }}
          />
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: 'var(--color-lagoon)' }}
          />
          <span
            className='ml-4 text-xs font-mono'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            contact_protocol.exe — {formData.name || 'guest'}@
            {status === 'submitting'
              ? 'transmitting'
              : status === 'success'
                ? 'delivered'
                : 'localhost'}
          </span>
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
                className='w-full py-4 px-6 rounded font-mono text-sm font-bold tracking-wider transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3'
                style={{
                  backgroundColor:
                    status === 'success'
                      ? 'var(--color-ok-400)'
                      : status === 'error'
                        ? 'var(--color-coral)'
                        : 'var(--color-lagoon)',
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
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Progress
                  </span>
                  <span style={{ color: 'var(--color-lagoon)' }}>
                    {progress}%
                  </span>
                </div>
                <div
                  className='h-6 font-mono text-xs flex items-center rounded overflow-hidden'
                  style={{ backgroundColor: 'var(--color-neutral-900)' }}
                >
                  <motion.div
                    className='h-full flex items-center font-mono'
                    style={{
                      backgroundColor: 'var(--color-lagoon)',
                      color: 'var(--color-neutral-950)',
                    }}
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
                  <span
                    className='pl-2 font-mono'
                    style={{ color: 'var(--color-neutral-600)' }}
                  >
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
                className='mt-6 p-4 rounded font-mono text-xs border'
                style={{
                  backgroundColor: 'var(--color-neutral-900)',
                  borderColor: 'var(--color-neutral-800)',
                }}
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
                    style={{ color: getOutputColor(line.type) }}
                    className='mb-1 whitespace-pre-wrap'
                  >
                    {line.text}
                  </motion.div>
                ))}

                {/* Blinking cursor after last line */}
                <motion.span
                  className='inline-block w-2 h-4 mt-1'
                  style={{
                    backgroundColor:
                      status === 'success'
                        ? 'var(--color-ok-400)'
                        : status === 'error'
                          ? 'var(--color-coral)'
                          : 'var(--color-lagoon)',
                  }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Command hint */}
          <div
            className='mt-6 pt-4 border-t font-mono text-xs'
            style={{
              borderColor: 'var(--color-neutral-800)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{ color: 'var(--color-lagoon)' }}>$</span> Type your
            message above or try commands:{' '}
            <span style={{ color: 'var(--color-dusk)' }}>help</span>,{' '}
            <span style={{ color: 'var(--color-dusk)' }}>clear</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalContactForm;
