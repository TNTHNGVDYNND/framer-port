import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center min-h-screen">
      <div className="mx-auto px-5 text-center max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Creative Developer & Designer
        </motion.h1>
        <motion.p
          className="mb-8 leading-relaxed text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          I design and code beautifully simple things, and I love what I do.
          Welcome to my digital garden.
        </motion.p>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link
            to="/work"
            className="inline-flex text-white bg-sky-600 border-0 py-2 px-6 focus:outline-none hover:bg-sky-700 rounded text-lg"
          >
            View My Work
          </Link>
          <Link
            to="/contact"
            className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;