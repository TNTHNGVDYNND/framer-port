import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <motion.div
      className='container mx-auto px-5 py-24 text-white min-h-screen flex items-center justify-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-2xl w-full'>
        <h1 className='text-4xl md:text-6xl font-bold text-center mb-12'>
          Get In Touch
        </h1>
        <ContactForm />
      </div>
    </motion.div>
  );
};

export default Contact;
