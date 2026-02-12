import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <div className='container mx-auto px-5 py-24 min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl w-full'>
        <h1 
          className='text-4xl md:text-6xl font-dune font-bold text-center mb-12'
          style={{ color: 'var(--color-heading)' }}
        >
          Get In Touch
        </h1>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
