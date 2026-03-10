import { motion } from 'framer-motion';
import CareerTimeline from '../components/CareerTimeline';
import TerminalSkills from '../components/TerminalSkills';
import MiniTerminal from '../components/MiniTerminal';

const About = () => {
  return (
    <motion.div
      className='min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section - Personal Intro */}
      <section className='px-4 md:px-8 pt-32 pb-16'>
        <div className='max-w-5xl mx-auto'>
          <motion.div
            className='mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Terminal window header */}
            <div className='flex items-center gap-2 mb-6'>
              <div
                className='w-3 h-3 rounded-full bg-coral'
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
                className='ml-4 text-sm font-mono'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                about.txt
              </span>
            </div>

            {/* Main heading */}
            <h1
              className='text-4xl md:text-6xl lg:text-7xl font-bold font-dune mb-6'
              style={{ color: 'var(--color-heading)' }}
            >
              <span className='text-neutral-500 font-mono text-2xl md:text-3xl block mb-2'>
                $
              </span>
              Tuanthong Vaidyanond
            </h1>

            {/* Multilingual indicator */}
            <div className='flex items-center gap-3 mb-8 font-mono text-sm'>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Languages:
              </span>
              {['EN', 'DE', 'ภาษาไทย'].map((lang, i) => (
                <span
                  key={lang}
                  className='px-2 py-1 rounded text-xs border'
                  style={{
                    backgroundColor: 'var(--color-neutral-100)',
                    borderColor: 'var(--color-neutral-200)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Introduction text */}
          <motion.div
            className='max-w-3xl space-y-6 text-lg leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'var(--color-text-primary)' }}
          >
            <p>
              I grew up in Bangkok, Thailand, in a vibrant urban environment
              that shaped my curiosity for how technology can improve lives.
              After completing an intensive program in full-stack web development
              (MERN), my idea is drawn by analytical mindset, an obsession with
              problem-solving, creating innovative solutions to complex problems,
              and a background that spans a mix of creativity and hands-on
              engineering.
            </p>
            <p
              className='font-mono text-sm'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span style={{ color: 'var(--color-ok-400)' }}>➜</span> I am
              actively seeking an apprenticeship or full-time role where I can
              contribute to a forward-thinking team. An opportunity to collaborate
              among a team of motivated developers to build a meaningful product
              is what I am looking for!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className='px-4 md:px-8 py-16'>
        <div className='max-w-5xl mx-auto'>
          <motion.div
            className='border rounded-lg p-8 md:p-12 relative overflow-hidden'
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              borderColor: 'var(--color-neutral-200)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative ASCII art */}
            <div
              className='absolute top-4 right-4 font-mono text-xs opacity-20 hidden md:block'
              style={{ color: 'var(--color-lagoon)' }}
            >
              ┌─┐ ┌─┐ ┌─┐
              <br />
              └─┘ └─┘ └─┘
            </div>

            <h2
              className='text-2xl md:text-3xl font-bold font-mono mb-6'
              style={{ color: 'var(--color-heading)' }}
            >
              <span className='text-neutral-500 mr-2'>$</span>The Building
              Blocks Philosophy
            </h2>

            <div
              className='prose prose-lg max-w-none'
              style={{ color: 'var(--color-text-primary)' }}
            >
              <p className='mb-4'>
                The Building Blocks represents the foundation and framework of
                web development—where every brick, tool, and technology comes
                together to create something remarkable.
              </p>
              <p>
                Just like architects rely on sturdy materials to craft
                magnificent structures, developers use their building blocks—as
                tools, and beyond—to design seamless user experiences and
                powerful backends. Explore this space to see how these essential
                pieces fit together to shape the web's future.
              </p>
            </div>

            {/* Status badge */}
            <div className='mt-8 flex items-center gap-3'>
              <div
                className='w-2 h-2 rounded-full animate-pulse'
                style={{ backgroundColor: 'var(--color-ok-400)' }}
              />
              <span
                className='font-mono text-sm'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Status: Seeking opportunities
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Career Timeline */}
      <CareerTimeline />

      {/* Terminal Skills */}
      <TerminalSkills />

      {/* Mini Terminal Easter Eggs */}
      <MiniTerminal />
    </motion.div>
  );
};

export default About;
