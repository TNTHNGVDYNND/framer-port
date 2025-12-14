import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavItem = ({ to, children }) => {
  return (
    <NavLink to={to} className="relative group text-gray-300 transition-colors duration-300 hover:text-white">
      {({ isActive }) => (
        <>
          <div className="relative overflow-hidden">
            <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
              {children}
            </span>
            <span className="block absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
              {children}
            </span>
          </div>
          {isActive && (
            <motion.div
              className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-white"
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

const Navbar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-white">
            <NavLink to="/">
              {({ isActive }) => (
                <div className="relative">
                  MyPortfolio
                  {isActive && (
                    <motion.div
                      className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-white"
                      layoutId="underline"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          </div>
          <div className="hidden md:flex space-x-8">
            <NavItem to="/work">Work</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
