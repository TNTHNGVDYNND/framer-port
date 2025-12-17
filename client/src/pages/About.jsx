import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      className="container mx-auto px-5 py-24 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold">About Me</h1>
      </div>
      <div className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">
        <p className="mb-4">
          Hello! I&apos;m a passionate and creative developer with a love for building beautiful, interactive, and user-friendly web applications. My journey into the world of code started with a fascination for how things work on the internet, and it has since grown into a full-fledged passion for crafting digital experiences.
        </p>
        <p className="mb-4">
          With a background in design and a strong foundation in modern frontend technologies like React, I strive to bridge the gap between aesthetics and functionality. I believe that great software is not just about powerful features, but also about providing a seamless and enjoyable experience for the end-user.
        </p>
        <p>
          When I&apos;m not coding, you can find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
