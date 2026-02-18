import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, UserPlus, Phone } from 'lucide-react';
import { GoogleGsiButton } from '../components/GoogleGsiButton';

const dashboardByRole = (role: 'buyer' | 'seller' | 'admin') =>
  role === 'buyer' ? '/buyer/dashboard' : role === 'seller' ? '/dashboard' : '/admin';

export function AuthSeller() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showGoogleLocationModal, setShowGoogleLocationModal] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<string | null>(null);
  const [googleLocation, setGoogleLocation] = useState('');
  const { show } = useToast();
  const { login, register, exchangeGoogleCredential } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCredential = async (credential: string) => {
    try {
      if (mode === 'register' && !location.trim()) {
        setPendingGoogleCredential(credential);
        setGoogleLocation('');
        setShowGoogleLocationModal(true);
        return;
      }
      const result = await exchangeGoogleCredential(credential, 'seller', mode === 'register' ? location : null);
      show(result.isNewUser ? 'Seller account created with Google' : 'Logged in with Google', 'success');
      navigate(dashboardByRole(result.user.role), { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed';
      if (String(msg).toLowerCase().includes('location is required')) {
        setPendingGoogleCredential(credential);
        setGoogleLocation(location || '');
        setShowGoogleLocationModal(true);
        return;
      }
      show(msg, 'error');
    }
  };

  const completeGoogleRegistration = async (selectedLocation: string) => {
    if (!selectedLocation.trim()) {
      show('Please select your district', 'error');
      return;
    }
    if (!pendingGoogleCredential) {
      show('Please try Google sign-in again', 'error');
      setShowGoogleLocationModal(false);
      return;
    }
    try {
      const result = await exchangeGoogleCredential(pendingGoogleCredential, 'seller', selectedLocation);
      show(result.isNewUser ? 'Seller account created with Google' : 'Logged in with Google', 'success');
      setPendingGoogleCredential(null);
      setShowGoogleLocationModal(false);
      setGoogleLocation('');
      navigate(dashboardByRole(result.user.role), { replace: true });
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

            <GoogleGsiButton onCredential={handleGoogleCredential} />

            <p className="text-[11px] text-slate-500 text-center">
              Continue with Google for instant access. We only use Google to verify identity.
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
                value={googleLocation}
                onChange={(e) => setGoogleLocation(e.target.value)}
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
                    setGoogleLocation('');
                    setPendingGoogleCredential(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => completeGoogleRegistration(googleLocation)}
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
