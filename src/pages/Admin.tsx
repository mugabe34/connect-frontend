import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import type { User, Product } from '../types';
import { LayoutDashboard, Users, Package, ShoppingCart, LineChart, Settings } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { UsersTable } from '../components/UsersTable';
import { ProductsTable } from '../components/ProductsTable';

type Section = 'overview' | 'users' | 'products' | 'orders' | 'reports' | 'settings';

const sectionIcons: Record<Section, React.ElementType> = {
  overview: LayoutDashboard,
  users: Users,
  products: Package,
  orders: ShoppingCart,
  reports: LineChart,
  settings: Settings,
};

export function Admin() {
  const [section, setSection] = useState<Section>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (section === 'overview') {
      api('/api/admin/dashboard').then(setDashboardData);
    }
    if (section === 'users') {
      api<User[]>('/api/admin/users').then(setUsers);
    }
    if (section === 'products') {
      api<Product[]>('/api/admin/products').then(setProducts);
    }
  }, [section]);

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className={`bg-gray-50 min-h-screen py-10`}>
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className={`text-4xl font-extrabold text-blue-800 tracking-tight`}>
            Admin Control Panel
          </h1>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <aside className="space-y-3">
            {(['overview', 'users', 'products', 'orders', 'reports', 'settings'] as Section[]).map((s) => {
              const Icon = sectionIcons[s];
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
                        ? `bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-md`
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

          <main className="md:col-span-3">
            {section === 'overview' && dashboardData && (
              <motion.div
                key="overview"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <DashboardCard title="Total Users" value={dashboardData.totalUsers} />
                <DashboardCard title="Total Products" value={dashboardData.totalProducts} />
                <DashboardCard title="Pending Approvals" value={dashboardData.pendingApprovals} />
              </motion.div>
            )}

            {section === 'users' && <UsersTable users={users} />}
            {section === 'products' && <ProductsTable products={products} />} 

            {/* Other sections can be implemented here */}
          </main>
        </div>
      </div>
    </div>
  );
}