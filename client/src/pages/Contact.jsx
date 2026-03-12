import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import ResumeDownload from '../components/ResumeDownload';

const Contact = () => {
  return (
    <motion.div
      className='min-h-screen py-24 px-4 md:px-8'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-5xl mx-auto'>
        {/* Terminal-style Header */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal window controls */}
          <div className='flex items-center gap-2 mb-6'>
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
              className='ml-4 text-sm font-mono'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              contact_protocol.exe
            </span>
          </div>

          {/* Main heading */}
          <h1
            className='text-4xl md:text-6xl font-bold font-mono mb-4'
            style={{ color: 'var(--color-heading)' }}
          >
            <span className='text-neutral-500 mr-2'>$</span>./initiate_contact
          </h1>

          <p
            className='font-mono text-sm max-w-2xl'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-status-success)' }}>➜</span> Ready to
            collaborate? Send a message through the secure terminal below.
            Response time: Usually within 24 hours.
          </p>
        </motion.div>

        {/* Contact Form */}
        <ContactForm />

        {/* Resume Download Section */}
        <motion.div
          className='mt-16'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className='flex items-center gap-4 mb-8'>
            <div
              className='h-px flex-1'
              style={{ backgroundColor: 'var(--color-neutral-200)' }}
            />
            <span
              className='font-mono text-sm'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span style={{ color: 'var(--color-brand-primary)' }}>$</span> get
              resume.pdf
            </span>
            <div
              className='h-px flex-1'
              style={{ backgroundColor: 'var(--color-neutral-200)' }}
            />
          </div>

          <ResumeDownload />
        </motion.div>

        {/* Additional contact info */}
        <motion.div
          className='mt-12 grid md:grid-cols-3 gap-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Email */}
          <div
            className='p-6 rounded-lg border font-mono text-sm'
            style={{
              backgroundColor: 'var(--color-outer-glow)',
              borderColor: 'var(--color-neutral-200)',
            }}
          >
            <div
              className='text-xs mb-2 uppercase tracking-wider'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Email Protocol
            </div>
            <a
              href='mailto:tuanthong.vaidyanond@gmail.com'
              className='transition-colors duration-300 hover:underline'
              style={{ color: 'var(--color-brand-primary)' }}
            >
              tuanthong.vaidyanond@gmail.com
            </a>
          </div>

          {/* GitHub */}
          <div
            className='p-6 rounded-lg border font-mono text-sm'
            style={{
              backgroundColor: 'var(--color-outer-glow)',
              borderColor: 'var(--color-neutral-200)',
            }}
          >
            <div
              className='text-xs mb-2 uppercase tracking-wider'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              GitHub Repository
            </div>
            <a
              href='https://github.com/TVATDCI'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors duration-300 hover:underline'
              style={{ color: 'var(--color-brand-primary)' }}
            >
              github.com/TVATDCI
            </a>
          </div>

          {/* LinkedIn */}
          <div
            className='p-6 rounded-lg border font-mono text-sm'
            style={{
              backgroundColor: 'var(--color-outer-glow)',
              borderColor: 'var(--color-neutral-200)',
            }}
          >
            <div
              className='text-xs mb-2 uppercase tracking-wider'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              LinkedIn Network
            </div>
            <a
              href='https://www.linkedin.com/in/tuanthong-vaidyanond-6789782b2'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors duration-300 hover:underline'
              style={{ color: 'var(--color-brand-primary)' }}
            >
              linkedin.com/in/tuanthong-vaidyanond
            </a>
          </div>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          className='mt-12 flex items-center justify-center gap-3 font-mono text-xs'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div
            className='w-2 h-2 rounded-full animate-pulse'
            style={{ backgroundColor: 'var(--color-status-success)' }}
          />
          <span>Status: Available for opportunities</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
