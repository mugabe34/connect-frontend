import { useAuth } from '../providers/AuthProvider';
import { SellerDashboard } from './SellerDashboard';
import Admin from './Admin';

/**
 * Dashboard Router Component
 * Routes users to the appropriate dashboard based on their role:
 * - 'seller' or 'buyer' → SellerDashboard
 * - 'admin' → Admin Dashboard
 */
export function DashboardRouter() {
  const { role } = useAuth();

  if (role === 'admin') {
    return <Admin />;
  }

  return <SellerDashboard />;
}

export default DashboardRouter;
