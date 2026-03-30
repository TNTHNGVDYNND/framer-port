import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggleBtn from './ThemeToggleBtn';
import { useAuth } from '../hooks/useAuth';

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
          transition-colors duration-300 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-brand-primary
          ${isActive ? 'text-white' : 'text-text-muted hover:text-text-base'}
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
                className='absolute left-0 top-0 bottom-0 w-1 bg-brand-primary'
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                aria-hidden='true'
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
  // Use AuthContext for reactive auth state
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/work', label: 'Work' },
    { to: '/theme', label: 'Theme' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        className='fixed left-0 top-0 bottom-0 w-16 bg-surface-base/80 backdrop-blur-md z-50 flex flex-col py-6 border-r border-brand-accent/20'
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
        role='navigation'
        aria-label='Main navigation'
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
            className='block focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-full'
            aria-label='Go to homepage'
          >
            <div
              className='w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold'
              style={{
                backgroundColor: 'var(--color-brand-accent)',
                color: 'var(--color-surface-base)',
              }}
              aria-hidden='true'
            >
              VN
            </div>
          </NavLink>
        </motion.div>

        {/* Navigation Items */}
        <ul
          className='flex-1 flex flex-col gap-2'
          role='menubar'
          aria-label='Navigation menu'
        >
          {menuItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label}>
              {item.label}
            </NavItem>
          ))}

          {/* Admin Dashboard Link - Only visible to admin */}
          {isAdmin && (
            <NavItem to='/admin' label='Admin Dashboard'>
              Admin
            </NavItem>
          )}
        </ul>

        {/* Auth & Theme Toggle Section */}
        <motion.div
          className='px-2 mt-auto flex flex-col gap-2'
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {/* Auth Button */}
          {isAuthenticated ? (
            <div className='flex flex-col gap-2'>
              {/* User Indicator */}
              <div className='flex items-center justify-center'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAdmin ? 'bg-green-500' : 'bg-brand-primary'
                  }`}
                  title={isAdmin ? 'Admin User' : 'Authenticated User'}
                />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='w-full py-2 px-1 font-mono text-xs text-center text-text-muted hover:text-brand-secondary transition-colors uppercase tracking-wider'
                aria-label='Logout'
              >
                <span
                  className='block pointer-events-none'
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          ) : (
            /* Login Link to /login page */
            <NavLink
              to='/login'
              className={({ isActive }) => `
                w-full py-2 px-1 font-mono text-xs text-center transition-colors uppercase tracking-wider
                ${isActive ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'}
              `}
              aria-label='Login'
            >
              <span
                className='block pointer-events-none'
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                }}
              >
                Login
              </span>
            </NavLink>
          )}

          {/* Divider */}
          <div className='h-px bg-brand-accent/20 my-2' />

          {/* Theme Toggle */}
          <ThemeToggleBtn />
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
