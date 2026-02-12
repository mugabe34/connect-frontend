import { useAuth } from '../providers/AuthProvider';
import { SellerDashboard } from './SellerDashboard';
import Admin from './Admin';

/**
 * Dashboard Router Component
 * =============================
 * Routes users to the appropriate dashboard based on their role:
 * 
 * SELLER DASHBOARD:
 * - Seller's inventory management (view, upload, delete products)
 * - Store statistics (total value, product count, engagement, approvals)
 * - Top performing products
 * - Store profile management
 * - WhatsApp integration for buyer contact
 * 
 * ADMIN DASHBOARD:
 * - System overview and analytics
 * - User management (view all users)
 * - Product management (all platform products)
 * - Reports and insights
 * - Settings and configuration
 */
export function Dashboard() {
  const { role } = useAuth();

  // Route to Admin Dashboard
  if (role === 'admin') {
    return <Admin />;
  }

  // Route to Seller Dashboard (default for seller/buyer roles)
  return <SellerDashboard />;
}

export default Dashboard;
