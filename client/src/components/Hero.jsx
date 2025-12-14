import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Preloader from "./Preloader";
import Curtain from "./Curtain";

const HeroContent = () => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-screen flex items-center justify-center"
    >
      <div className="mx-auto px-5 text-center max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight text-white"
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
          className="mb-8 leading-relaxed text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          I design and code beautifully simple things, and I love what I do.
          Welcome to my digital garden.
        </motion.p>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          <Link
            to="/work"
            className="inline-flex text-white bg-sky-600 border-0 py-2 px-6 focus:outline-none hover:bg-sky-500 rounded text-lg"
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
    </motion.div>
  );
};

const Hero = () => {
  const [loadingState, setLoadingState] = useState(0); // 0: preloader, 1: curtain, 2: content

  useEffect(() => {
    if (loadingState === 0) {
      const timer = setTimeout(() => setLoadingState(1), 2000);
      return () => clearTimeout(timer);
    } else if (loadingState === 1) {
      const timer = setTimeout(() => setLoadingState(2), 500); // User-specified duration
      return () => clearTimeout(timer);
    }
  }, [loadingState]);

  const renderContent = () => {
    switch (loadingState) {
      case 0:
        return <Preloader key="preloader" />;
      case 1:
        return <Curtain key="curtain" />;
      case 2:
      default:
        return <HeroContent key="hero-content" />;
    }
  };

  return (
    <section>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </section>
  );
};

export default Hero;
