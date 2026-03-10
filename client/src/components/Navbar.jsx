import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggleBtn from './ThemeToggleBtn';

const NavItem = ({ to, children, label }) => {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
          },
        },
      }}
      className='pointer-events-auto'
    >
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) => `
          relative block px-4 py-3 font-mono text-xs uppercase tracking-wider
          transition-colors duration-300 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-lagoon
          ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}
        `}
        aria-label={`Navigate to ${label} page`}
        aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
      >
        {({ isActive }) => (
          <>
            {/* Vertical sliding indicator */}
            {isActive && (
              <motion.div
                layoutId='activeIndicator'
                className='absolute left-0 top-0 bottom-0 w-1 bg-lagoon'
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                aria-hidden="true"
              />
            )}
            {/* Vertical text */}
            <span
              className='block pointer-events-none'
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
            >
              {children}
            </span>
          </>
        )}
      </NavLink>
    </motion.li>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

const Sidebar = () => {
  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/work', label: 'Work' },
    { to: '/theme', label: 'Theme' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      className='fixed left-0 top-0 bottom-0 w-16 bg-neutral-50/80 backdrop-blur-md z-50 flex flex-col py-6 border-r border-dusk/20'
      variants={{
        hidden: { x: -100, opacity: 0 },
        visible: {
          x: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.1,
          },
        },
      }}
      initial='hidden'
      animate='visible'
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo/Brand */}
      <motion.div
        className='px-2 mb-8 flex justify-center'
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }}
      >
        <NavLink 
          to='/' 
          className='block focus:outline-none focus:ring-2 focus:ring-lagoon rounded-full'
          aria-label="Go to homepage"
        >
          <div
            className='w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold'
            style={{
              backgroundColor: 'var(--color-dusk)',
              color: 'var(--color-neutral-50)',
            }}
            aria-hidden="true"
          >
            VN
          </div>
        </NavLink>
      </motion.div>

      {/* Navigation Items */}
      <ul 
        className='flex-1 flex flex-col gap-2'
        role="menubar"
        aria-label="Navigation menu"
      >
        {menuItems.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label}>
            {item.label}
          </NavItem>
        ))}
      </ul>

      {/* Theme Toggle */}
      <motion.div
        className='px-2 mt-auto'
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        <ThemeToggleBtn />
      </motion.div>
    </motion.nav>
  );
};

export default Sidebar;
