import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../components/Toast';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
// Import icons
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export function AuthSeller() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { show } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // NOTE: Logic remains unchanged
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'register') {
        await register(name, email, password, 'seller');
        show('Registered successfully', 'success');
        setMode('login');
      } else {
        await login(email, password);
        show('Logged in successfully', 'success');
        navigate('/dashboard');
      }
    } catch (e: any) {
      show(e.message || 'Failed', 'error');
    }
  }

  // Animation variants for the mode transition
  const formVariant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    // Background with a subtle gradient/color
    <div className={`bg-gray-50/70 min-h-screen py-16`}>
      <div className="container-max">
        <motion.div
          key={mode} // Key changes to re-trigger transition on mode change
          initial="initial"
          animate="animate"
          exit="exit"
          variants={formVariant}
          className={`max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl shadow-orange-100`}
        >
          {/* Header with Mode Toggle */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
              {mode === 'login' ? <LogIn className='h-6 w-6 text-gray-600' /> : <UserPlus className='h-6 w-6 text-gray-600' />}
              Seller {mode === 'login' ? 'Login' : 'Registration'}
            </h1>
            <motion.button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className={`text-orange-600 hover:text-orange-800 font-semibold text-sm transition duration-300 hover:underline`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'login' ? 'Create a Seller Account' : 'Have an account? Login'}
            </motion.button>
          </div>

          {/* Authentication Form */}
          <form className="space-y-5" onSubmit={submit}>
            {/* Name Field (Register Mode) */}
            {mode === 'register' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <User className='h-4 w-4 text-gray-500' />
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition duration-200`}
                  placeholder="Seller Name"
                  required
                />
              </motion.div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <Mail className='h-4 w-4 text-gray-500' />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition duration-200`}
                placeholder="you@example.com"
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <Lock className='h-4 w-4 text-gray-500' />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition duration-200`}
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 rounded-xl bg-orange-600 text-white text-lg font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 transform hover:scale-[1.01] transition duration-300`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              {mode === 'login' ? 'Login to Seller Account' : 'Register as a Seller'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}