import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const skillCategories = [
  {
    title: 'FRONTEND',
    color: 'var(--color-lagoon)',
    skills: [
      { name: 'React', level: 85 },
      { name: 'JavaScript', level: 90 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'Framer Motion', level: 75 },
    ],
  },
  {
    title: 'BACKEND',
    color: 'var(--color-dusk)',
    skills: [
      { name: 'Node.js', level: 75 },
      { name: 'Express', level: 75 },
      { name: 'MongoDB', level: 60 },
    ],
  },
  {
    title: 'TOOLS',
    color: 'var(--color-neutral-400)',
    skills: [
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 50 },
      { name: 'Figma', level: 65 },
    ],
  },
];

const getSkillColor = (level) => {
  if (level >= 80) return 'var(--color-lagoon)';
  if (level >= 60) return 'var(--color-dusk)';
  return 'var(--color-neutral-400)';
};

const SkillBar = ({ skill, index }) => {
  const barColor = getSkillColor(skill.level);

  return (
    <motion.div
      className='mb-3'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className='flex justify-between items-center mb-1'>
        <span className='font-mono text-sm text-text-primary'>
          {skill.name}
        </span>
        <motion.span
          className='font-mono text-xs'
          style={{ color: barColor }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {skill.level}%
        </motion.span>
      </div>

      {/* Terminal-style bar container */}
      <div className='relative h-6 font-mono text-xs flex items-center bg-neutral-100'>
        {/* Progress bar fill */}
        <motion.div
          className='absolute left-0 top-0 bottom-0 flex items-center'
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          style={{
            backgroundColor: barColor,
          }}
        >
          {/* Terminal block characters */}
          <span
            className='pl-2 text-white font-mono'
            style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
          >
            {Array(Math.ceil(skill.level / 10))
              .fill('█')
              .join('')}
          </span>
        </motion.div>

        {/* Empty space indicator */}
        <motion.span
          className='absolute font-mono pl-2 text-neutral-300'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.8 }}
        >
          {Array(10 - Math.ceil(skill.level / 10))
            .fill('░')
            .join('')}
        </motion.span>
      </div>
    </motion.div>
  );
};

SkillBar.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const SkillCategory = ({ category, index }) => {
  return (
    <motion.div
      className='mb-8'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Category header */}
      <div className='flex items-center gap-2 mb-4'>
        <div
          className='w-2 h-2 rounded-full'
          style={{ backgroundColor: category.color }}
        />
        <h3
          className='font-mono text-sm font-bold tracking-wider'
          style={{ color: category.color }}
        >
          {category.title}
        </h3>
        <div className='flex-1 h-px bg-neutral-200' />
      </div>

      {/* Skills list */}
      <div className='space-y-1'>
        {category.skills.map((skill, skillIndex) => (
          <SkillBar key={skill.name} skill={skill} index={skillIndex} />
        ))}
      </div>
    </motion.div>
  );
};

SkillCategory.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        level: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const TerminalSkills = () => {
  // Calculate overall proficiency
  const allSkills = skillCategories.flatMap((cat) => cat.skills);
  const overallLevel = Math.round(
    allSkills.reduce((acc, skill) => acc + skill.level, 0) / allSkills.length
  );

  return (
    <section className='py-24 px-4 md:px-8 relative'>
      <div className='max-w-5xl mx-auto'>
        {/* Terminal window header */}
        <motion.div
          className='mb-8 border-b pb-4 border-neutral-200'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-3 h-3 rounded-full bg-coral' />
            <div className='w-3 h-3 rounded-full bg-dusk' />
            <div className='w-3 h-3 rounded-full bg-lagoon' />
            <span className='ml-4 text-sm font-mono text-text-secondary'>
              skills.txt
            </span>
          </div>

          <h2 className='text-3xl md:text-4xl font-bold font-mono text-heading'>
            <span className='text-neutral-500 mr-2'>$</span>./display_skills.sh
          </h2>
          <p className='mt-2 font-mono text-sm text-text-secondary'>
            <span className='text-ok-400'>➜</span> Loading technical
            proficiencies...
          </p>
        </motion.div>

        {/* Skills container - Responsive grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>

        {/* Overall proficiency */}
        <motion.div
          className='mt-12 pt-8 border-t border-neutral-200'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className='flex items-center justify-between mb-2'>
            <span className='font-mono text-sm text-text-primary'>
              Overall Proficiency
            </span>
            <span className='font-mono text-sm font-bold text-lagoon'>
              {overallLevel}%
            </span>
          </div>

          {/* Overall progress bar */}
          <div className='relative h-8 font-mono text-xs flex items-center rounded bg-neutral-100'>
            <motion.div
              className='absolute left-0 top-0 bottom-0 flex items-center rounded'
              initial={{ width: 0 }}
              whileInView={{ width: `${overallLevel}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                ease: 'easeOut',
              }}
              style={{
                background: `linear-gradient(90deg, var(--color-lagoon), var(--color-dusk))`,
              }}
            >
              <span
                className='pl-3 text-white font-mono font-bold'
                style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
              >
                {Array(Math.ceil(overallLevel / 10))
                  .fill('█')
                  .join('')}
              </span>
            </motion.div>
            <span className='absolute font-mono pl-3 text-neutral-300'>
              {Array(10 - Math.ceil(overallLevel / 10))
                .fill('░')
                .join('')}
            </span>
          </div>

          {/* Blinking cursor */}
          <motion.div
            className='mt-6 font-mono text-sm flex items-center gap-2'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <span className='text-lagoon'>$</span>
            <motion.span
              className='w-2 h-4 bg-lagoon'
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalSkills;
