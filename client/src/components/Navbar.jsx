import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
const NavItem = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className="relative group text-neutral-500 transition-colors duration-300 hover:text-neutral-950"
    >
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
              className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-neutral-950"
              layoutId="underline"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
    <nav className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center text-2xl font-bold text-neutral-500 space-x-4">
            <NavLink to="/">
              {({ isActive }) => (
                <div className="relative">
                  MyPortfolio
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-ok-500"
                      layoutId="underline"
                      initial={false}
                      transition={{
                        type: "spring",
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
          <div className="hidden md:flex items-center space-x-8">
            <NavItem to="/theme">Theme</NavItem>
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
