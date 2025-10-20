import { useState } from 'react';
import { motion } from 'framer-motion';
// Import icons for a professional dashboard look
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  LineChart,
  Settings,
  LogIn,
} from 'lucide-react';

type Section = 'overview' | 'users' | 'products' | 'orders' | 'reports' | 'settings';

// Map sections to their respective icons
const sectionIcons: Record<Section, React.ElementType> = {
  overview: LayoutDashboard,
  users: Users,
  products: Package,
  orders: ShoppingCart,
  reports: LineChart,
  settings: Settings,
};

// Define a placeholder primary color (Deep Blue for Admin professionalism)
const PRIMARY_COLOR = 'blue';

export function Admin() {
  const [section, setSection] = useState<Section>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Variants for main content transition
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    // Outer container with clean background
    <div className={`bg-gray-50 min-h-screen py-10`}>
      <div className="container-max">
        {/* Header and Login Form */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className={`text-4xl font-extrabold text-${PRIMARY_COLOR}-800 tracking-tight`}>
            Admin Control Panel
          </h1>
          
          {/* Login Form with subtle animation and modern styling */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-white border border-${PRIMARY_COLOR}-100 rounded-xl p-3 shadow-lg shadow-${PRIMARY_COLOR}-50/50 mt-4 sm:mt-0`}
          >
            <form className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                placeholder="Admin Email"
                aria-label="Admin Email"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                placeholder="Password"
                aria-label="Password"
              />
              <motion.button
                className={`flex items-center gap-1 px-4 py-2 rounded-lg bg-${PRIMARY_COLOR}-600 text-black text-sm font-semibold hover:bg-${PRIMARY_COLOR}-700 transition duration-300 shadow-md`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className='h-4 w-4' />
                Login
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Sidebar and Main Content Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="space-y-3">
            {(['overview', 'users', 'products', 'orders', 'reports', 'settings'] as Section[]).map((s) => {
              const Icon = sectionIcons[s]; // Get the icon component
              const isActive = section === s;
              
              return (
                <motion.button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl transition duration-300 
                    font-medium flex items-center gap-3
                    ${
                      isActive
                        ? `bg-${PRIMARY_COLOR}-50 text-${PRIMARY_COLOR}-700 border-l-4 border-${PRIMARY_COLOR}-500 shadow-md`
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 border-l-4 border-transparent'
                    }
                  `}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className='h-5 w-5' />
                  {s[0].toUpperCase() + s.slice(1)}
                </motion.button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3">
            {/* Conditional Rendering for Sections */}
            
            {section === 'overview' && (
              <motion.div
                key="overview"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {['Users', 'Products', 'Orders'].map((k, i) => (
                  <motion.div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition duration-300 cursor-default"
                    whileHover={{ y: -2 }}
                  >
                    <div className="text-sm font-medium text-gray-500">Total {k}</div>
                    <div className={`text-4xl font-extrabold mt-2 text-${PRIMARY_COLOR}-600`}>
                      {(i + 1) * 123}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* General Content Section Template */}
            {section !== 'overview' && (
              <motion.div
                key={section}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl"
              >
                <h2 className={`text-2xl font-bold mb-4 text-${PRIMARY_COLOR}-700`}>
                  Manage {section.charAt(0).toUpperCase() + section.slice(1)}
                </h2>
                <p className="text-gray-600 border-l-4 border-yellow-400 pl-4 py-1">
                  {/* Content based on section */}
                  {section === 'users' && 'Create, suspend, and assign roles for users (stub).'}
                  {section === 'products' && 'Approve, edit, and remove product listings (stub).'}
                  {section === 'orders' && 'Track order status and resolve shipping/payment issues (stub).'}
                  {section === 'reports' && 'View sales, activity, and performance charts (stub).'}
                  {section === 'settings' && 'Configure core platform parameters and integrations (stub).'}
                </p>
                
                {/* Placeholder button for professional look */}
                <motion.button 
                    className={`mt-6 px-4 py-2 rounded-full border border-${PRIMARY_COLOR}-300 text-${PRIMARY_COLOR}-600 bg-${PRIMARY_COLOR}-50 hover:bg-${PRIMARY_COLOR}-100 transition duration-300 font-medium text-sm`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    View Details
                </motion.button>
              </motion.div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}