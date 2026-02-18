import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from './Toast';
import { motion } from 'framer-motion';
import { useState } from 'react'
import conlogo from '../assets/conlogo-256.png'
import {
  Home,
  LockKeyhole,
  Info,
  PhoneCall,
  UserPlus,
  ShoppingBag,
  Store,
  LogIn,
} from 'lucide-react';

export function Navbar() {
  const { role } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const onAboutPage = location.pathname === '/about';

  const browseProducts = () => {
    setOpen(false);
    if (role !== 'buyer') {
      show('Please sign in as a buyer to browse products.', 'info');
      navigate('/auth/buyer');
      return;
    }
    navigate('/products');
  };

  const startSelling = () => {
    setOpen(false);
    if (role === 'seller' || role === 'admin') {
      navigate('/dashboard');
      return;
    }
    navigate('/auth/seller');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-base font-medium transition-colors duration-300 flex items-center gap-1 ${
      isActive
        ? `text-sky-700`
        : 'text-gray-700 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/95 backdrop-blur-sm shadow-md shadow-gray-100/50">
      <nav className="container-max h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={conlogo} alt="Connect" className="h-16 w-auto" loading="eager" decoding="async" />
          <span className="sr-only">Connect</span>
        </Link>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={getNavLinkClass}>
            <Home className="h-4 w-4" /> Home
          </NavLink>
          <NavLink to="/contact" className={getNavLinkClass}>
            <PhoneCall className="h-4 w-4" /> Contact Us
          </NavLink>
          
          <NavLink to="/about" className={getNavLinkClass}>
            <Info className="h-4 w-4" /> About
          </NavLink>
          <NavLink to="/auth" className={getNavLinkClass}>
            <UserPlus className="h-4 w-4" /> Sign In/Sign Up
          </NavLink>
          {role === 'admin' && (
            <NavLink to="/admin" className={getNavLinkClass}>
              <LockKeyhole className="h-4 w-4" /> Admin Panel
            </NavLink>
          )}
        </div>

        {/* Call To Action: buyer / seller sign-in options */}
        <div className="hidden md:flex items-center gap-3">
          {role === 'guest' && (
            <>
              <button
                onClick={() => navigate('/auth/buyer')}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-800 hover:border-sky-300 hover:text-sky-800 transition"
              >
                I&apos;m a Buyer
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/auth/seller')}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 shadow-lg shadow-sky-200 transition duration-300"
              >
                <UserPlus className="h-4 w-4" />
                I&apos;m a Seller
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="px-3 py-2 rounded border"
          >
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container-max py-4 space-y-3">
            {onAboutPage && (
              <div className="space-y-2 pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={browseProducts}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Browse Products
                </button>
                <button
                  type="button"
                  onClick={startSelling}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Store className="h-4 w-4" />
                  Start Selling
                </button>
              </div>
            )}
            <NavLink to="/" onClick={() => setOpen(false)} className="block">
              Home
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className="block">
              Contact Us
            </NavLink>
           
            <NavLink to="/about" onClick={() => setOpen(false)} className="block">
              About
            </NavLink>
            <NavLink to="/auth" onClick={() => setOpen(false)} className="block">
              Sign In / Sign Up
            </NavLink>
            {role === 'admin' && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="block">
                Admin
              </NavLink>
            )}
            {role === 'guest' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/auth/buyer');
                  }}
                  className="flex-1 px-3 py-2 rounded border border-slate-200 text-sm inline-flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Buyer
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/auth/seller');
                  }}
                  className="flex-1 px-3 py-2 rounded bg-sky-600 text-white text-sm inline-flex items-center justify-center gap-2"
                >
                  <Store className="h-4 w-4" />
                  Seller
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
