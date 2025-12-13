import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  const title = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const titleText = "Creative Developer & Designer";

  return (
    <section className="text-white flex items-center justify-center h-screen">
      <div className="mx-auto px-5 text-center max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
          variants={title}
          initial="hidden"
          animate="visible"
        >
          {titleText.split(" ").map((char, index) => (
            <motion.span
              key={index}
              variants={word}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}{" "}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="mb-8 leading-relaxed text-lg text-red-500 max-w-2xl mx-auto"
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
