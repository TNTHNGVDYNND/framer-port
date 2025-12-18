import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      console.log('Form submission successful:', result);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-gray-800 p-8 rounded-lg shadow-lg'
    >
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-gray-300 text-sm font-bold mb-2'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600'
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='email'
          className='block text-gray-300 text-sm font-bold mb-2'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600'
          required
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='message'
          className='block text-gray-300 text-sm font-bold mb-2'
        >
          Message
        </label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          rows='5'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600'
          required
        ></textarea>
      </div>
      <div className='flex items-center justify-between'>
        <button
          type='submit'
          className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && (
          <p className='text-green-500 text-sm ml-4'>
            Message sent successfully!
          </p>
        )}
        {status === 'error' && (
          <p className='text-red-500 text-sm ml-4'>
            Failed to send message. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
