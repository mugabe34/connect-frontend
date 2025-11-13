import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { useState } from 'react'
import conlogo from '../assets/conlogo.png'
// Import only needed icons
import {
 Home,
 Package,
 LayoutDashboard,
 ChevronDown,
 LockKeyhole,
 LogIn,
} from 'lucide-react';

export function Navbar() {
 const { role, setRole } = useAuth();
 const navigate = useNavigate();
 const [open, setOpen] = useState(false)

 // Custom class logic for NavLink with hover effect
 const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
 `relative text-base font-medium transition-colors duration-300 flex items-center gap-1 ${
 isActive
 ? `text-orange-600`
 : 'text-gray-700 hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
 }`;

 return (
 <header className={`sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur-sm shadow-md shadow-gray-100/50`}>
 <nav className="container-max h-20 flex items-center justify-between">
 
 {/* Logo */}
 <Link to="/" className="flex items-center gap-2">
 <img src={conlogo} alt="Connect" className="h-16 w-auto" />
 <span className={`sr-only`}>Connect</span>
 </Link>

 {/* Main Navigation Links */}
 <div className="hidden md:flex items-center gap-8">
 <NavLink to="/" className={getNavLinkClass}>
 <Home className='h-4 w-4' /> Home
 </NavLink>
 <NavLink to="/products" className={getNavLinkClass}>
 <Package className='h-4 w-4' /> Products
 </NavLink>
 
 {(role === 'seller' || role === 'admin') && (
 <NavLink to="/dashboard" className={getNavLinkClass}>
 <LayoutDashboard className='h-4 w-4' /> Dashboard
 </NavLink>
 )}
 
 {role === 'admin' && (
 <NavLink to="/admin" className={getNavLinkClass}>
 <LockKeyhole className='h-4 w-4' /> Admin Panel
 </NavLink>
 )}
 </div>

 {/* Role Switcher and Action Buttons */}
 <div className="hidden md:flex items-center gap-4">
 
 {/* Role Switcher (Pure Icon & Professional Styling) */}
 <div className="relative">
 <ChevronDown className='absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none z-10' />
 <select
 aria-label="Role"
 className={`border border-gray-300 rounded-full pl-3 pr-8 py-2 text-sm appearance-none bg-white font-medium text-gray-700 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200`}
 value={role}
 onChange={(e) => {
 const next = e.target.value as any
 setRole(next)
 if (next === 'seller') navigate('/auth/seller')
 if (next === 'admin') navigate('/auth/admin')
 }}
 >
 <option value="guest">Guest View</option>
 <option value="buyer">Buyer</option>
 <option value="seller">Seller</option>
 <option value="admin">Admin</option>
 </select>
 </div>

 {/* Admin Login Button (Secondary Action) */}
 <motion.button
 whileHover={{ scale:1.05 }}
 whileTap={{ scale:0.98 }}
 onClick={() => navigate('/admin')}
 className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition duration-300`}
 >
 <LockKeyhole className='h-4 w-4' />
 <span>Admin Login</span>
 </motion.button>
 
 {/* Primary Action Button (Seller CTA) */}
 <motion.button
 whileHover={{ scale:1.05 }}
 whileTap={{ scale:0.98 }}
 onClick={() => navigate('/auth/seller')}
 className={`flex items-center gap-2 px-5 py-2 rounded-full bg-orange-600 text-black font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition duration-300`}
 >
 <LogIn className='h-5 w-5' />
 Sell Now
 </motion.button>
 </div>

 {/* Mobile menu button */}
 <div className="md:hidden flex items-center gap-2">
 <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="px-3 py-2 rounded border">
 <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
 <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
 <span className="block w-5 h-0.5 bg-gray-700"></span>
 </button>
 </div>
 </nav>

 {/* Mobile dropdown */}
 {open && (
 <div className="md:hidden border-t bg-white">
 <div className="container-max py-4 space-y-3">
 <NavLink to="/" onClick={() => setOpen(false)} className="block">Home</NavLink>
 <NavLink to="/products" onClick={() => setOpen(false)} className="block">Products</NavLink>
 {(role === 'seller' || role === 'admin') && (
 <NavLink to="/dashboard" onClick={() => setOpen(false)} className="block">Dashboard</NavLink>
 )}
 {role === 'admin' && (
 <NavLink to="/admin" onClick={() => setOpen(false)} className="block">Admin</NavLink>
 )}
 <div className="pt-2">
 <label className="text-sm text-gray-600">Role</label>
 <select
 className="mt-1 w-full border rounded px-3 py-2"
 value={role}
 onChange={(e) => {
 const next = e.target.value as any
 setRole(next)
 if (next === 'seller') navigate('/auth/seller')
 if (next === 'admin') navigate('/auth/admin')
 }}
 >
 <option value="guest">Guest</option>
 <option value="buyer">Buyer</option>
 <option value="seller">Seller</option>
 <option value="admin">Admin</option>
 </select>
 </div>
 <div className="flex gap-2">
 <button onClick={() => { setOpen(false); navigate('/admin') }} className="flex-1 px-3 py-2 rounded border">Admin Login</button>
 <button onClick={() => { setOpen(false); navigate('/auth/seller') }} className={`flex-1 px-3 py-2 rounded bg-orange-600 text-white`}>Sell Now</button>
 </div>
 </div>
 </div>
 )}
 </header>
 );
}
