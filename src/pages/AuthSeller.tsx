import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, UserPlus, Phone } from 'lucide-react';

export function AuthSeller() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showGoogleLocationModal, setShowGoogleLocationModal] = useState(false);
  const { show } = useToast();
  const { login, register, loginWithGoogleSSO } = useAuth();
  const navigate = useNavigate();

  // Handle Google Sign-In flow for sellers (requires location selection)
  const handleGoogleSignIn = async () => {
    try {
      // For sellers, we need location. For login mode, use direct login
      if (mode === 'login') {
        await loginWithGoogleSSO(null, 'seller');
        show('Logged in successfully', 'success');
        navigate('/dashboard');
      } else {
        // For register mode, show location selection modal first
        setShowGoogleLocationModal(true);
      }
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed';
      if (String(msg).toLowerCase().includes('location is required')) {
        setShowGoogleLocationModal(true);
        return;
      }
      show(msg, 'error');
    }
  };

  // Complete Google registration with location
  const completeGoogleRegistration = async (selectedLocation: string) => {
    if (!selectedLocation.trim()) {
      show('Please select your district', 'error');
      return;
    }
    try {
      await loginWithGoogleSSO(selectedLocation, 'seller');
      show('Registered and logged in successfully', 'success');
      setShowGoogleLocationModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      show(err.message || 'Registration failed', 'error');
    }
  };

  // NOTE: Logic remains unchanged
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          show('Passwords do not match', 'error');
          return;
        }
        if (!phone.trim()) {
          show('Phone number is required for sellers', 'error');
          return;
        }
        if (!location.trim()) {
          show('Please select your district', 'error');
          return;
        }
        await register(name, email, password, 'seller', { phone, location });
        show('Registered successfully', 'success');
        navigate('/dashboard');
      } else {
        await login(email, password);
        show('Logged in successfully', 'success');
        const isAdminCredentials = email === 'm2@gmail.com' && password === '2k2024@G';
        navigate(isAdminCredentials ? '/admin' : '/dashboard');
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
    <div className="bg-gradient-to-br from-sky-50 via-white to-slate-100 min-h-screen py-16">
      <div className="container-max">
        <motion.div
          key={mode} // Key changes to re-trigger transition on mode change
          initial="initial"
          animate="animate"
          exit="exit"
          variants={formVariant}
          className="max-w-md mx-auto bg-white/95 border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-sky-100/70"
        >
          {/* Header with Mode Toggle */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              {mode === 'login' ? <LogIn className='h-6 w-6 text-gray-600' /> : <UserPlus className='h-6 w-6 text-gray-600' />}
              Seller {mode === 'login' ? 'Login' : 'Registration'}
            </h1>
            <motion.button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sky-600 hover:text-sky-800 font-semibold text-sm transition duration-300 hover:underline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'login' ? 'Create a Seller Account' : 'Have an account? Login'}
            </motion.button>
          </div>

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
                <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                  placeholder="Legal business / seller name"
                  required
                />
              </motion.div>
            )}

              {/* Location (district) select for Rwanda */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="location-select" className="block text-sm font-semibold mb-2 text-slate-700">District (Rwanda)</label>
                  <select
                    id="location-select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                    required
                  >
                    <option value="">Select your district</option>
                    <optgroup label="Kigali City">
                      <option>Gasabo</option>
                      <option>Kicukiro</option>
                      <option>Nyarugenge</option>
                    </optgroup>
                    <optgroup label="Eastern Province">
                      <option>Bugesera</option>
                      <option>Gatsibo</option>
                      <option>Kayonza</option>
                      <option>Kirehe</option>
                      <option>Ngoma</option>
                      <option>Nyagatare</option>
                      <option>Rwamagana</option>
                    </optgroup>
                    <optgroup label="Northern Province">
                      <option>Burera</option>
                      <option>Gakenke</option>
                      <option>Gicumbi</option>
                      <option>Musanze</option>
                      <option>Rulindo</option>
                    </optgroup>
                    <optgroup label="Southern Province">
                      <option>Gisagara</option>
                      <option>Huye</option>
                      <option>Kamonyi</option>
                      <option>Muhanga</option>
                      <option>Nyamagabe</option>
                      <option>Nyanza</option>
                      <option>Nyaruguru</option>
                      <option>Ruhango</option>
                    </optgroup>
                    <optgroup label="Western Province">
                      <option>Karongi</option>
                      <option>Ngororero</option>
                      <option>Nyabihu</option>
                      <option>Nyamasheke</option>
                      <option>Rubavu</option>
                      <option>Rusizi</option>
                      <option>Rutsiro</option>
                    </optgroup>
                  </select>
                </div>
              )}

            {/* Phone Field (Register Mode) */}
            {mode === 'register' && (
              <motion.div
                key="phone-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  WhatsApp phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition duration-200"
                  placeholder="+234 800 000 0000"
                  required={mode === 'register'}
                />
              </motion.div>
            )}
            
            {/* Email Field */}
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
            
            {/* Password Field */}
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

            {/* Confirm Password (Register Mode) */}
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
                  required={mode === 'register'}
                />
              </div>
            )}
            
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl bg-sky-600 text-white text-base sm:text-lg font-semibold hover:bg-sky-700 shadow-xl shadow-sky-200 transform hover:scale-[1.01] transition duration-300"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              {mode === 'login' ? 'Login to Seller Account' : 'Register as a Seller'}
            </motion.button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 uppercase tracking-[0.18em]">
                  or continue with
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 hover:border-sky-300 shadow-sm"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
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
            </motion.button>

            <p className="text-[11px] text-slate-500 text-center">
              We only use Google to verify your identity. Your marketplace activity stays within Connect.
            </p>
          </form>
        </motion.div>

        {/* Google Location Modal */}
        {showGoogleLocationModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Select Your District
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Help buyers find you by selecting where you operate.
              </p>
              <select
                id="google-location-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 mb-6 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                aria-label="Select your district"
              >
                <option value="">Select your district</option>
                <optgroup label="Kigali City">
                  <option>Gasabo</option>
                  <option>Kicukiro</option>
                  <option>Nyarugenge</option>
                </optgroup>
                <optgroup label="Eastern Province">
                  <option>Bugesera</option>
                  <option>Gatsibo</option>
                  <option>Kayonza</option>
                  <option>Kirehe</option>
                  <option>Ngoma</option>
                  <option>Nyagatare</option>
                  <option>Rwamagana</option>
                </optgroup>
                <optgroup label="Northern Province">
                  <option>Burera</option>
                  <option>Gakenke</option>
                  <option>Gicumbi</option>
                  <option>Musanze</option>
                  <option>Rulindo</option>
                </optgroup>
                <optgroup label="Southern Province">
                  <option>Gisagara</option>
                  <option>Huye</option>
                  <option>Kamonyi</option>
                  <option>Muhanga</option>
                  <option>Nyamagabe</option>
                  <option>Nyanza</option>
                  <option>Nyaruguru</option>
                  <option>Ruhango</option>
                </optgroup>
                <optgroup label="Western Province">
                  <option>Karongi</option>
                  <option>Ngororero</option>
                  <option>Nyabihu</option>
                  <option>Nyamasheke</option>
                  <option>Rubavu</option>
                  <option>Rusizi</option>
                  <option>Rutsiro</option>
                </optgroup>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowGoogleLocationModal(false);
                    setLocation('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => completeGoogleRegistration(location)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
