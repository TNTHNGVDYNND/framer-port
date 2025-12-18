import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggleBtn from './ThemeToggleBtn';
const NavItem = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className='relative group font-dune text-driftwood/60 transition-colors duration-300 hover:text-driftwood px-3 py-2 font-medium text-xs uppercase'
    >
      {({ isActive }) => (
        <>
          <div className='relative overflow-hidden'>
            <span className='block transition-transform duration-300 ease-in-out group-hover:-translate-y-full'>
              {children}
            </span>
            <span className='block absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0'>
              {children}
            </span>
          </div>
          {isActive && (
            <motion.div
              className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-neutral-950"
              layoutId="underline"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Navbar = () => {
  return (
    <nav className='bg-bg-t sticky top-0 z-50 px-4 py-2 shadow-xs shadow-dusk'>
      <div className='container px-4 rounded-4xl bg-neutral-500/10 mx-auto'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center text-base--line-height space-x-4 font-dune text-center text-heading bg-dusk/10 size-16 rounded-full px-4'>
            <NavLink to='/'>
              {({ isActive }) => (
                <div className='relative'>
                  myPortfolio
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-ok-500"
                      layoutId="underline"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              )}
            </NavLink>
            <ThemeToggle />
          </div>
          <div className='hidden md:flex space-x-8'>
            <ThemeToggleBtn />
            <NavItem to='/theme'>Theme</NavItem>
            <NavItem to='/work'>Work</NavItem>
            <NavItem to='/about'>About</NavItem>
            <NavItem to='/contact'>Contact</NavItem>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
