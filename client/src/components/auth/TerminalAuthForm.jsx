import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { TerminalHeader, BlinkingCursor } from '../primitives';
import { useAuth } from '../../hooks/useAuth';

const TerminalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  rightElement = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className='mb-6'>
      {/* Label as terminal command */}
      <div className='flex items-center gap-2 mb-2 font-mono text-sm'>
        <span className='text-ok-500'>➜</span>
        <span className='uppercase tracking-wider text-text-primary'>
          {label}:
        </span>
        {required && (
          <span className='text-xs text-brand-secondary'>[required]</span>
        )}
      </div>

      {/* Input field container */}
      <div className='terminal-input relative flex items-center gap-2'>
        {/* Terminal prompt */}
        <span className='font-mono text-lg select-none text-brand-primary'>
          {'>'}
        </span>

        {/* Input field */}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className='flex-1 bg-transparent border-none outline-none font-mono text-sm text-text-primary'
          placeholder={`Enter ${label.toLowerCase()}...`}
        />

        {/* Right element (e.g., password toggle) */}
        {rightElement && <span className='flex-shrink-0'>{rightElement}</span>}

        {/* Blinking cursor */}
        {isFocused && <BlinkingCursor className='w-2 h-5 bg-brand-primary' />}
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
  disabled: PropTypes.bool,
  rightElement: PropTypes.node,
};

const TerminalAuthForm = ({ onSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [error, setError] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);

  // Use AuthContext for login/register
  const { login, register } = useAuth();

  const addTerminalLine = (text, type = 'system') => {
    setTerminalOutput((prev) => [...prev, { id: Date.now(), text, type }]);
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    clearTerminal();

    // Simulate terminal output
    addTerminalLine(`$ ./auth_${mode}.sh`, 'command');
    addTerminalLine(
      '[SYSTEM] Initializing authentication protocol...',
      'system'
    );
    addTerminalLine(`[PROCESSING] Validating ${mode} credentials...`, 'system');

    try {
      if (mode === 'login') {
        // Use AuthContext login function
        const data = await login(formData.email, formData.password);

        addTerminalLine('[SUCCESS] Authentication successful!', 'success');
        addTerminalLine(`[INFO] Welcome back, ${data.email}`, 'info');
        addTerminalLine(`[INFO] Role: ${data.role.toUpperCase()}`, 'info');
        addTerminalLine('[SYSTEM] Redirecting to home...', 'system');

        setStatus('success');

        // Auto-close and redirect after 2 seconds
        setTimeout(() => {
          if (onSuccess) onSuccess(data);
        }, 2000);
      } else {
        // Use AuthContext register function
        await register(formData.email, formData.password);

        addTerminalLine('[SUCCESS] Account created successfully!', 'success');
        addTerminalLine('[INFO] Please login with your credentials', 'info');
        setStatus('success');

        // Switch to login mode after 2 seconds
        setTimeout(() => {
          setMode('login');
          setStatus('idle');
          setFormData({ email: '', password: '' });
          clearTerminal();
        }, 2000);
      }
    } catch (err) {
      addTerminalLine('[ERROR] Authentication failed!', 'error');
      addTerminalLine(`[DETAILS] ${err.message}`, 'error');
      setError(err.message);
      setStatus('error');

      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    clearTerminal();
    setFormData({ email: '', password: '' });
  };

  const getTerminalTitle = () => {
    if (status === 'submitting') return 'auth_process.exe — authenticating';
    if (status === 'success') return 'auth_process.exe — access_granted';
    if (status === 'error') return 'auth_process.exe — access_denied';
    return `auth_${mode}.exe — ready`;
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* Terminal Window Container */}
      <motion.div
        className='terminal-window bg-outer-glow'
        style={{
          borderColor: 'var(--color-border-default)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Terminal Header */}
        <div
          className='terminal-window__header bg-surface-base'
          style={{
            borderColor: 'var(--color-border-default)',
          }}
        >
          <TerminalHeader filename={getTerminalTitle()} />
        </div>

        {/* Terminal Body */}
        <div className='p-6 md:p-8'>
          {/* Mode Toggle */}
          <div className='flex gap-2 mb-6 font-mono text-xs'>
            <button
              type='button'
              onClick={() => mode !== 'login' && toggleMode()}
              className={`px-3 py-2 rounded transition-colors ${
                mode === 'login'
                  ? 'bg-brand-primary text-text-base'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              disabled={status === 'submitting'}
            >
              [LOGIN]
            </button>
            <button
              type='button'
              onClick={() => mode !== 'register' && toggleMode()}
              className={`px-3 py-2 rounded transition-colors ${
                mode === 'register'
                  ? 'bg-brand-primary text-text-base'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              disabled={status === 'submitting'}
            >
              [REGISTER]
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
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
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={status === 'submitting'}
              rightElement={
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-xs font-mono text-text-secondary hover:text-brand-primary transition-colors px-2'
                  tabIndex={-1}
                >
                  {showPassword ? '[HIDE]' : '[SHOW]'}
                </button>
              }
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
                  color: 'var(--color-text-base)',
                  opacity: status === 'submitting' ? 0.7 : 1,
                }}
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              >
                <span>
                  {status === 'submitting'
                    ? mode === 'login'
                      ? '[AUTHENTICATING...]'
                      : '[CREATING ACCOUNT...]'
                    : status === 'success'
                      ? mode === 'login'
                        ? '[ACCESS GRANTED]'
                        : '[ACCOUNT CREATED]'
                      : status === 'error'
                        ? '[FAILED]'
                        : mode === 'login'
                          ? '> LOGIN'
                          : '> REGISTER'}
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

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className='mt-4 p-3 rounded font-mono text-xs bg-brand-secondary/20 border border-brand-secondary text-brand-secondary'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Output */}
          <AnimatePresence>
            {terminalOutput.length > 0 && (
              <motion.div
                className='mt-6 p-4 rounded font-mono text-xs border bg-surface-base border-border-default'
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
          <div className='mt-6 pt-4 border-t font-mono text-xs border-border-default text-text-secondary'>
            <span className='text-brand-primary'>$</span>{' '}
            {mode === 'login' ? 'New user?' : 'Have an account?'}{' '}
            <button
              type='button'
              onClick={toggleMode}
              disabled={status === 'submitting'}
              className='text-brand-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {mode === 'login' ? 'register here' : 'login here'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

TerminalAuthForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default TerminalAuthForm;
