import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-white">
            <Link to="/">MyPortfolio</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/work"
              className="relative overflow-hidden group text-gray-300 transition-colors duration-300 hover:text-white"
            >
              <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                Work
              </span>
              <span className="block absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
                Work
              </span>
            </Link>
            <Link
              to="/about"
              className="relative overflow-hidden group text-gray-300 transition-colors duration-300 hover:text-white"
            >
              <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                About
              </span>
              <span className="block absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
                About
              </span>
            </Link>
            <Link
              to="/contact"
              className="relative overflow-hidden group text-gray-300 transition-colors duration-300 hover:text-white"
            >
              <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                Contact
              </span>
              <span className="block absolute inset-0 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
                Contact
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
