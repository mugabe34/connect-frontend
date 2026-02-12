import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export function AuthBuyer() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { show } = useToast();
  const { user, isLoading, login, register, loginWithGoogleSSO } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user?.role === 'buyer') {
      navigate('/buyer/dashboard', { replace: true });
    }
  }, [isLoading, user, navigate]);

  const formVariant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          show('Passwords do not match', 'error');
          return;
        }
        await register(name, email, password, 'buyer');
        show('Buyer account created successfully', 'success');
        navigate('/buyer/dashboard', { replace: true });
      } else {
        const signedInUser = await login(email, password);
        if (signedInUser.role !== 'buyer') {
          show('This account is not a buyer account', 'error');
          navigate(signedInUser.role === 'seller' ? '/dashboard' : '/admin', { replace: true });
          return;
        }
        show('Logged in successfully', 'success');
        navigate('/buyer/dashboard', { replace: true });
      }
    } catch (err: any) {
      show(err.message || 'Authentication failed', 'error');
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogleSSO(null, 'buyer');
      show('Logged in successfully', 'success');
      navigate('/buyer/dashboard', { replace: true });
    } catch (err: any) {
      show(err.message || 'Google sign-in failed', 'error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-slate-100 min-h-screen py-16">
      <div className="container-max">
        <motion.div
          key={mode}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={formVariant}
          className="max-w-md mx-auto bg-white/95 border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-sky-100/70"
        >
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              {mode === 'login' ? (
                <LogIn className="h-6 w-6 text-gray-600" />
              ) : (
                <UserPlus className="h-6 w-6 text-gray-600" />
              )}
              Buyer {mode === 'login' ? 'Login' : 'Registration'}
            </h1>
            <motion.button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sky-600 hover:text-sky-800 font-semibold text-sm transition duration-300 hover:underline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'login' ? 'Create a Buyer Account' : 'Have an account? Login'}
            </motion.button>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            {mode === 'register' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                  placeholder="Your name"
                  required
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-500" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-500" />
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl bg-sky-600 text-white text-base sm:text-lg font-semibold hover:bg-sky-700 shadow-xl shadow-sky-200 transform hover:scale-[1.01] transition duration-300"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              {mode === 'login' ? 'Login as Buyer' : 'Register as a Buyer'}
            </motion.button>

            <div className="pt-4">
              <div className="flex items-center gap-3 my-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-500 font-semibold">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition inline-flex items-center justify-center gap-3"
                aria-label="Continue with Google"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200">
                  <svg role="img" aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.85 2.5 30.37 0 24 0 14.62 0 6.51 5.56 2.56 13.64l8.05 6.26C12.43 13.4 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.08-.41-4.5H24v9h12.65c-.54 2.91-2.18 5.37-4.65 7.05l7.15 5.56C43.9 37.64 46.5 31.57 46.5 24.5z"/>
                    <path fill="#FBBC05" d="M10.61 28.09A14.5 14.5 0 0 1 9.5 24c0-1.41.24-2.77.68-4.06l-8.05-6.26A23.93 23.93 0 0 0 0 24c0 3.9.94 7.58 2.61 10.82l8-6.73z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.82l-7.15-5.56c-2 1.35-4.58 2.13-8.74 2.13-6.26 0-11.57-3.9-13.39-9.34l-8 6.73C6.51 42.44 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </span>
                Continue with Google
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
