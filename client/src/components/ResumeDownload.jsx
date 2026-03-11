import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalHeader from './primitives/TerminalHeader';
import { useProgressSimulation } from '../hooks';

const ResumeDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { progress, start: startProgress } = useProgressSimulation(() => {
    setIsDownloading(false);
    const link = document.createElement('a');
    link.href = '/resume-update.pdf';
    link.download = 'Tuanthong_Vaidyanond_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  const handleDownload = () => {
    setIsDownloading(true);
    startProgress();
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <motion.div
        className='terminal-window bg-card-bg'
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className='terminal-window__header bg-neutral-100'>
          <TerminalHeader filename='resume_download.exe' />
        </div>

        {/* Body */}
        <div className='p-6 md:p-8'>
          {/* Title */}
          <h3 className='text-2xl font-bold font-mono mb-4 text-heading'>
            <span className='text-neutral-500 mr-2'>$</span>get_resume.pdf
          </h3>

          <p className='font-mono text-sm mb-6 text-text-secondary'>
            <span className='text-ok-400'>➜</span> Download my latest resume or
            scan the QR code for mobile viewing.
          </p>

          {/* Download Button */}
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            className='w-full py-4 px-6 rounded font-mono text-sm font-bold tracking-wider transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4 focus-ring'
            style={{
              backgroundColor: isDownloading
                ? 'var(--color-neutral-300)'
                : 'var(--color-lagoon)',
              color: 'var(--color-neutral-950)',
            }}
            whileHover={{ scale: isDownloading ? 1 : 1.02 }}
            whileTap={{ scale: isDownloading ? 1 : 0.98 }}
          >
            {isDownloading ? (
              <>
                <span>[DOWNLOADING...]</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  █
                </motion.span>
              </>
            ) : (
              <span>{'> DOWNLOAD RESUME'}</span>
            )}
          </motion.button>

          {/* Progress Bar */}
          <AnimatePresence>
            {isDownloading && (
              <motion.div
                className='mb-6'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className='flex justify-between text-xs font-mono mb-2'>
                  <span className='text-text-secondary'>Progress</span>
                  <span className='text-lagoon'>{progress}%</span>
                </div>
                <div className='h-6 font-mono text-xs flex items-center rounded overflow-hidden bg-neutral-100'>
                  <motion.div
                    className='h-full flex items-center font-mono bg-lagoon text-neutral-950'
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
                  <span className='pl-2 font-mono text-neutral-400'>
                    {Array(10 - Math.ceil(progress / 10))
                      .fill('░')
                      .join('')}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* QR Code Toggle */}
          <button
            onClick={toggleQR}
            className='w-full py-3 px-6 rounded font-mono text-sm border transition-all duration-300 flex items-center justify-center gap-2 bg-transparent border-neutral-300 text-text-primary hover:bg-neutral-100 focus-ring'
          >
            <span>{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
            <span>{showQR ? '▲' : '▼'}</span>
          </button>

          {/* QR Code Display */}
          <AnimatePresence>
            {showQR && (
              <motion.div
                className='mt-6 p-6 rounded border text-center bg-neutral-50 border-border-color'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* ASCII QR Code Representation */}
                <div className='font-mono text-xs leading-none mb-4 inline-block text-text-primary'>
                  <pre className='text-center'>
                    {`█▀▀▀▀▀█ ▀▄▄▄▀ █▀▀▀▀▀█
█ ███ █ ▀▄▄▄▀ █ ███ █
█ ▀▀▀ █ ▄▀▄▀▄ █ ▀▀▀ █
▀▄▄▄▄▄▀ ▀ ▀ ▀ ▀▄▄▄▄▄▀
▀▄▄▄ ▀▄▄▄▀▀▄▀▄ ▄▀▄▀▀
▄▄▄▀▄▀▄ ▀▄▀▄▄▄▀▄▄▀▄▀
▀▄▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▄▀
█▀▀▀▀▀█ ▄▀▄▄▀▄ █▀▀▀▀▀█
█ ███ █ ▀▄▀▄▀▄ █ ███ █
█ ▀▀▀ █ ▄▄▀▄▄▀ █ ▀▀▀ █
▀▄▄▄▄▄▀ ▀▄▄▄▄▀ ▀▄▄▄▄▄▀`}
                  </pre>
                </div>
                <p className='font-mono text-xs text-text-secondary'>
                  Scan with your phone camera
                </p>
                <p className='font-mono text-xs mt-2 text-neutral-400'>
                  (Or click the download button above)
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File info */}
          <div className='mt-6 pt-4 border-t font-mono text-xs flex justify-between border-border-color text-text-secondary'>
            <span>File: resume-update.pdf</span>
            <span>Format: PDF</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeDownload;
