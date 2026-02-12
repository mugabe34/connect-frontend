import { useState, useEffect, type ElementType } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import type { User, Product } from '../types';
import { LayoutDashboard, Users, Package, LineChart, Settings } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { UsersTable } from '../components/UsersTable';
import { ProductsTable } from '../components/ProductsTable';
import { useToast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useAuth } from '../providers/AuthProvider';

type Section = 'overview' | 'users' | 'products' | 'reports' | 'settings';

const sectionIcons: Record<Section, ElementType> = {
  overview: LayoutDashboard,
  users: Users,
  products: Package,
  reports: LineChart,
  settings: Settings,
};

export function Admin() {
  const { logout } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reports, setReports] = useState<{ seller: User; totalProducts: number; activeProducts: number }[]>([]);
  const [userForm, setUserForm] = useState<Partial<User> & { password?: string; bio?: string; avatarUrl?: string }>({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [messageModal, setMessageModal] = useState<{ open: boolean; user: User | null; subject: string; body: string }>({ open: false, user: null, subject: '', body: '' });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [resetPwModal, setResetPwModal] = useState<{ open: boolean; user: User | null; password: string }>({
    open: false,
    user: null,
    password: ''
  });
  const [confirmProduct, setConfirmProduct] = useState<{ open: boolean; action: 'approve' | 'delete'; product: Product | null }>({
    open: false,
    action: 'approve',
    product: null
  });
  const { show } = useToast();

  useEffect(() => {
    if (section === 'overview') {
      api('/api/admin/dashboard').then(setDashboardData);
    }
    if (section === 'users') {
      fetchUsers();
    }
    if (section === 'products') {
      api<Product[]>('/api/admin/products').then(setProducts);
    }
    if (section === 'reports') {
      loadReports();
    }
  }, [section]);

  const fetchUsers = async () => {
    const list = await api<User[]>('/api/admin/users');
    setUsers(list);
  };

  const openCreateUser = () => {
    setUserForm({ role: 'buyer' });
    setIsCreating(true);
    setIsUserModalOpen(true);
    setTargetUser(null);
  };

  const openEditUser = (user: User) => {
    setTargetUser(user);
    setUserForm({ ...user });
    setIsCreating(false);
    setIsUserModalOpen(true);
  };

  const saveUser = async () => {
    try {
      if (isCreating) {
        await api('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        show('User created', 'success');
      } else if (targetUser) {
        await api(`/api/admin/users/${targetUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        show('User updated', 'success');
      }
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      show(err.message || 'Unable to save user', 'error');
    }
  };

  const requestDeleteUser = (user: User) => {
    setConfirmDelete({ open: true, user });
  };

  const deleteUser = async () => {
    if (!confirmDelete.user) return;
    try {
      await api(`/api/admin/users/${confirmDelete.user.id}`, { method: 'DELETE' });
      show('User deleted', 'success');
      setConfirmDelete({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      show(err.message || 'Could not delete user', 'error');
      setConfirmDelete({ open: false, user: null });
    }
  };

  const openMessageModal = (user: User) => {
    if (user.role !== 'seller') return;
    setMessageModal({ open: true, user, subject: '', body: '' });
  };

  const sendMessage = async () => {
    if (!messageModal.user) return;
    if (!messageModal.body.trim()) {
      show('Please write a message', 'error');
      return;
    }
    try {
      await api(`/api/admin/users/${messageModal.user.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: messageModal.subject, body: messageModal.body }),
      });
      show('Message sent to seller', 'success');
      setMessageModal({ open: false, user: null, subject: '', body: '' });
    } catch (err: any) {
      show(err.message || 'Could not send message', 'error');
    }
  };

  const approveProduct = async (product: Product) => {
    try {
      await api(`/api/admin/products/${product.id}/approve`, { method: 'POST' });
      show('Product approved', 'success');
      api<Product[]>('/api/admin/products').then(setProducts);
    } catch (err: any) {
      show(err.message || 'Unable to approve', 'error');
    }
  };

  const deleteProduct = async (product: Product) => {
    try {
      await api(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      show('Product deleted', 'success');
      api<Product[]>('/api/admin/products').then(setProducts);
    } catch (err: any) {
      show(err.message || 'Unable to delete product', 'error');
    }
  };

  const requestApproveProduct = (product: Product) => setConfirmProduct({ open: true, action: 'approve', product });
  const requestDeleteProduct = (product: Product) => setConfirmProduct({ open: true, action: 'delete', product });

  const confirmProductAction = async () => {
    if (!confirmProduct.product) return;
    const product = confirmProduct.product;
    setConfirmProduct({ open: false, action: 'approve', product: null });
    if (confirmProduct.action === 'approve') {
      await approveProduct(product);
    } else {
      await deleteProduct(product);
    }
  };

  const openResetPassword = (user: User) => {
    setResetPwModal({ open: true, user, password: '' });
  };

  const loadReports = async () => {
    try {
      const [sellers, adminProducts] = await Promise.all([
        api<User[]>('/api/admin/users?role=seller'),
        api<Product[]>('/api/admin/products'),
      ]);

      const rows = sellers.map((seller) => {
        const sellerProducts = adminProducts.filter((product) => {
          const productSellerId = (product.seller as any)?._id || (product.seller as any)?.id || (product.seller as any);
          return productSellerId === (seller as any)._id || productSellerId === seller.id;
        });
        const activeProducts = sellerProducts.filter((p) => p.approved).length;
        return { seller, totalProducts: sellerProducts.length, activeProducts };
      });

      setReports(rows);
    } catch (err: any) {
      show(err.message || 'Unable to load reports', 'error');
    }
  };

  const resetPassword = async () => {
    if (!resetPwModal.user) return;
    if (resetPwModal.password.length < 6) {
      show('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      await api(`/api/admin/users/${resetPwModal.user.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPwModal.password }),
      });
      show('Password updated', 'success');
      setResetPwModal({ open: false, user: null, password: '' });
    } catch (err: any) {
      show(err.message || 'Could not update password', 'error');
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Admin Control Panel</h1>
          <button onClick={logout} className="ml-auto px-4 py-2 rounded bg-red-600 text-white font-semibold">Sign Out</button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <aside className="space-y-3">
            {(['overview', 'users', 'products', 'reports', 'settings'] as Section[]).map((s) => {
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

            {section === 'users' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Users</h2>
                  <button
                    onClick={openCreateUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
                <UsersTable
                  users={users}
                  onView={openEditUser}
                  onResetPassword={openResetPassword}
                  onDelete={requestDeleteUser}
                  onMessage={openMessageModal as any}
                />
              </>
            )}
            {section === 'products' && <ProductsTable products={products} onApprove={requestApproveProduct} onDelete={requestDeleteProduct} />} 

            {section === 'reports' && (
              <motion.div
                key="reports"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Seller performance</p>
                    <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
                  </div>
                  <span className="text-sm text-slate-500">Total sellers: {reports.length}</span>
                </div>

                {reports.length === 0 ? (
                  <p className="text-sm text-slate-600">No seller data yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[720px]">
                      <thead>
                        <tr className="text-sm text-slate-500">
                          <th className="p-2">Seller</th>
                          <th className="p-2">Email</th>
                          <th className="p-2 text-center">Products Uploaded</th>
                          <th className="p-2 text-center">Active (Approved)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((row) => (
                          <tr key={row.seller.id || (row.seller as any)._id} className="border-t">
                            <td className="p-2 font-medium text-slate-900">{row.seller.name}</td>
                            <td className="p-2 text-slate-600">{row.seller.email}</td>
                            <td className="p-2 text-center">{row.totalProducts}</td>
                            <td className="p-2 text-center text-emerald-700 font-semibold">{row.activeProducts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* Other sections can be implemented here */}
          </main>
        </div>
      </div>
    </div>

    {/* User modal */}
    {isUserModalOpen && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <h3 className="text-xl font-bold">{isCreating ? 'Add User' : 'Edit User'}</h3>
          <div className="grid grid-cols-1 gap-3">
            <input value={userForm.name || ''} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Name" className="border rounded px-3 py-2" />
            <input value={userForm.email || ''} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="Email" className="border rounded px-3 py-2" />
            {isCreating && (
              <input type="password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Password" className="border rounded px-3 py-2" />
            )}
            <select value={userForm.role || 'buyer'} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })} className="border rounded px-3 py-2">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <input value={(userForm as any).phone || ''} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="Phone" className="border rounded px-3 py-2" />
            <input value={(userForm as any).location || ''} onChange={(e) => setUserForm({ ...userForm, location: e.target.value })} placeholder="Location" className="border rounded px-3 py-2" />
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append('avatar', file);
                const res = await api<{ url: string }>('/api/uploads/avatar', { method: 'POST', body: formData });
                setUserForm({ ...userForm, avatarUrl: res.url });
              }
            }} />
            <textarea value={(userForm as any).bio || ''} onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })} placeholder="Bio" className="border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={saveUser} className="px-4 py-2 bg-blue-600 text-white rounded">{isCreating ? 'Create' : 'Update'}</button>
          </div>
        </div>
      </div>
    )}

    {/* Message modal */}
    {messageModal.open && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <h3 className="text-xl font-bold">Message to {messageModal.user?.name}</h3>
          <input
            value={messageModal.subject}
            onChange={(e) => setMessageModal(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Subject (optional)"
            className="border rounded px-3 py-2 w-full"
          />
          <textarea
            value={messageModal.body}
            onChange={(e) => setMessageModal(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write your message"
            className="border rounded px-3 py-2 w-full min-h-[120px]"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setMessageModal({ open: false, user: null, subject: '', body: '' })} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={sendMessage} className="px-4 py-2 bg-emerald-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    )}

    {/* Reset password modal */}
    {resetPwModal.open && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <h3 className="text-xl font-bold">Reset password</h3>
          <p className="text-sm text-slate-600">
            Set a new password for <span className="font-semibold">{resetPwModal.user?.name}</span>.
          </p>
          <input
            type="password"
            value={resetPwModal.password}
            onChange={(e) => setResetPwModal(prev => ({ ...prev, password: e.target.value }))}
            placeholder="New password (min 6 chars)"
            className="border rounded px-3 py-2 w-full"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setResetPwModal({ open: false, user: null, password: '' })} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={resetPassword} className="px-4 py-2 bg-amber-600 text-white rounded">Update</button>
          </div>
        </div>
      </div>
    )}

    <ConfirmDialog
      isOpen={confirmDelete.open}
      title="Delete user"
      message={`Are you sure you want to delete ${confirmDelete.user?.name}?`}
      type="danger"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={deleteUser}
      onCancel={() => setConfirmDelete({ open: false, user: null })}
    />

    <ConfirmDialog
      isOpen={confirmProduct.open}
      title={confirmProduct.action === 'approve' ? 'Approve product' : 'Delete product'}
      message={
        confirmProduct.action === 'approve'
          ? `Approve "${confirmProduct.product?.title}" so it becomes visible to buyers?`
          : `Delete "${confirmProduct.product?.title}"? This cannot be undone.`
      }
      type={confirmProduct.action === 'approve' ? 'info' : 'danger'}
      confirmText={confirmProduct.action === 'approve' ? 'Approve' : 'Delete'}
      cancelText="Cancel"
      onConfirm={confirmProductAction}
      onCancel={() => setConfirmProduct({ open: false, action: 'approve', product: null })}
    />
    </>
  );
}

export default Admin;
