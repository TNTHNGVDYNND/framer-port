import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TerminalAuthForm from '../components/auth/TerminalAuthForm';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirect to home after successful login
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-20'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-lg'
      >
        <TerminalAuthForm onSuccess={handleSuccess} />
      </motion.div>
    </div>
  );
};

export default Login;
