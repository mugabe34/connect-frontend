import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getImageUrl } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../components/Toast';
import { NotificationSidebar } from '../components/NotificationSidebar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Product, Message } from '../types';
import conlogo from '../assets/conlogo-256.png';
import {
  UploadCloud,
  PackageSearch,
  Plus,
  UserCircle2,
  Edit,
  Trash2,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  TrendingUp,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Layers,
  X
} from 'lucide-react';

type SellerTab = 'overview' | 'products' | 'upload' | 'profile';

export function SellerDashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<SellerTab>('overview');
  const [summary, setSummary] = useState<{
    totalProducts: number;
    totalLikes: number;
    approvedProducts: number;
    pendingProducts: number;
    topLiked: Product[];
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [profileConfirmOpen, setProfileConfirmOpen] = useState(false);
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const { user, setUser, logout } = useAuth();
  const { show } = useToast();

  // Logic: Fetching products
  async function fetchMyProducts() {
    if (!user) return;
    try {
      const products = await api<Product[]>(`/api/products/seller/${user.id}`);
      setMyProducts(products);
    } catch (err) { console.error('Failed to fetch products', err); }
  }

  async function fetchMessages() {
    try {
      const data = await api<Message[]>('/api/messages/me');
      setMessages(data);
    } catch (err: any) {
      console.error('Failed to load messages', err);
      show(err.message || 'Failed to load messages', 'error');
    }
  }

  useEffect(() => {
    fetchMyProducts();
    async function loadSummary() {
      if (!user) return;
      try {
        const data = await api<{
          seller: any;
          topLiked: Product[];
          stats: any;
        }>(`/api/products/seller/${user.id}/summary`);
        setSummary({ ...data.stats, topLiked: data.topLiked });
      } catch (err) { console.error('Failed to load summary', err); }
    }
    loadSummary();
    if (user) {
      setName(user.name);
      setBio((user as any).bio || '');
      setAvatarUrl((user as any).avatarUrl || '');
    }
    fetchMessages();
  }, [user]);

  const hasProducts = myProducts.length > 0;

  // Logic: Upload product
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !category) {
      show('Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    if (user) {
        formData.append('contactEmail', user.email);
        if (user.phone) formData.append('contactPhone', user.phone);
    }
    if (images && images.length > 0) {
      const imageField = editingProductId ? 'newImages' : 'images';
      for (let i = 0; i < images.length; i++) {
        formData.append(imageField, images[i]);
      }
    }

    try {
      setIsUploading(true);
      if (editingProductId) {
        await api(`/api/products/${editingProductId}`, { method: 'PUT', body: formData });
        show('Product updated successfully!', 'success');
      } else {
        if (!images || images.length === 0) {
          show('Please upload at least one product image', 'error');
          setIsUploading(false);
          return;
        }
        await api('/api/products', { method: 'POST', body: formData });
        show('Product published successfully!', 'success');
      }
      setTitle(''); setPrice(''); setCategory(''); setDescription(''); setImages(null); setEditingProductId(null);
      setImagePreviews([]);
      setActiveTab('products');
      fetchMyProducts();
    } catch (error: any) {
      show(error.message || 'Failed to create product', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  // Handle image file selection and preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate files
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        show(`${file.name} is not a valid image`, 'error');
        continue;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        show(`${file.name} is too large (max 10MB)`, 'error');
        continue;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target?.result as string);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }

    // Create new FileList-like object
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    setImages(dataTransfer.files);
  };

  const showDeleteConfirm = (productId: string, productTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
      isLoading: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
          await api(`/api/products/${productId}`, { method: 'DELETE' });
          show('Product deleted successfully', 'success');
          await fetchMyProducts();
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
          show(error.message || 'Failed to delete product', 'error');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleProfileSave = async () => {
    try {
      const res = await api<{ user: any }>('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, bio, avatarUrl }),
        headers: { 'Content-Type': 'application/json' },
      });
      setUser(res.user);
      setName(res.user?.name ?? '');
      setBio(res.user?.bio ?? '');
      setAvatarUrl(res.user?.avatarUrl ?? '');
      show('Profile updated successfully', 'success');
      setProfileConfirmOpen(false);
    } catch (err: any) {
      show(err.message || 'Could not update profile. Please try again.', 'error');
      setProfileConfirmOpen(false);
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setTitle(product.title);
    setPrice(String(product.price));
    setCategory(product.category || '');
    setDescription(product.description || '');
    setImagePreviews(product.images?.map((img) => getImageUrl(img.url)) || []);
    setActiveTab('upload');
  };

  const handlePasswordChange = async () => {
    try {
      await api('/api/auth/me/password', {
        method: 'PATCH',
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: { 'Content-Type': 'application/json' },
      });
      show('Password updated successfully', 'success');
      setOldPassword(''); setNewPassword('');
      setPasswordConfirmOpen(false);
    } catch (err: any) {
      show(err.message || 'Could not update password. Please try again.', 'error');
      setPasswordConfirmOpen(false);
    }
  };

  const withVersion = (url: string, version?: string) =>
    version ? `${url}${url.includes('?') ? '&' : '?'}v=${version}` : url;
  const avatarBase = avatarUrl || (user as any)?.avatarUrl || '';
  const sellerAvatar = avatarBase
    ? withVersion(getImageUrl(avatarBase), user?.updatedAt ? encodeURIComponent(user.updatedAt) : undefined)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'S')}&background=0f172a&color=fff`;

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 font-sans">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        isLoading={confirmDialog.isLoading}
      />
      <ConfirmDialog
        isOpen={profileConfirmOpen}
        title="Save Profile"
        message="Do you want to save your profile changes?"
        confirmText="Save"
        cancelText="Cancel"
        type="info"
        onConfirm={handleProfileSave}
        onCancel={() => setProfileConfirmOpen(false)}
      />
      <ConfirmDialog
        isOpen={passwordConfirmOpen}
        title="Change Password"
        message="Confirm updating your password now?"
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
        onConfirm={handlePasswordChange}
        onCancel={() => setPasswordConfirmOpen(false)}
      />
      
      <NotificationSidebar />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded border border-slate-200 hover:bg-slate-50"
        aria-label="Toggle menu"
        title="Toggle menu"
      >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-slate-900"></div>
          <div className="w-6 h-0.5 bg-slate-900"></div>
          <div className="w-6 h-0.5 bg-slate-900"></div>
        </div>
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col py-6 px-6 z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src={conlogo} alt="Logo" className="h-9 w-auto" />
          <span className="font-bold text-xl tracking-tight text-slate-800">Connect</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={PackageSearch} label="My Inventory" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={Plus} label="Add Product" active={activeTab === 'upload'} onClick={() => { setActiveTab('upload'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={UserCircle2} label="Store Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200">
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Workspace</span>
              <h2 className="text-sm font-bold text-slate-700">{user?.name}'s Store</h2>
            </div>
            <div className="flex items-center gap-2 md:gap-3 bg-slate-100 p-1 pr-2 md:pr-3 rounded border border-slate-200">
                <img src={sellerAvatar} className="h-8 w-8 rounded border border-white shadow-sm" alt="avatar" />
                <span className="text-xs font-bold text-slate-600 hidden sm:inline">{user?.email}</span>
            </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-2 text-lg">Performance insights for your active listings.</p>
                </header>

                {!hasProducts ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded p-10 md:p-14 text-center">
                    <PackageSearch size={52} className="mx-auto text-slate-300 mb-5" />
                    <h3 className="text-2xl font-bold text-slate-900">No products yet</h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                      Your store starts empty. Upload your first product to make it visible to buyers.
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg w-full sm:w-auto"
                    >
                      <Plus size={18} /> Create your first listing
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard title="Total Value" value={`FRw ${myProducts.reduce((acc, p) => acc + Number(p.price), 0).toLocaleString()}`} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
                      <StatCard title="Products" value={summary?.totalProducts ?? 0} icon={Layers} color="text-emerald-600" bg="bg-emerald-50" />
                      <StatCard title="Engagement" value={`${summary?.totalLikes ?? 0} Likes`} icon={ThumbsUp} color="text-purple-600" bg="bg-purple-50" />
                      <StatCard title="Approval" value={summary?.approvedProducts ?? 0} icon={CheckCircle2} color="text-sky-600" bg="bg-sky-50" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Top Performers</h3>
                            <button onClick={() => setActiveTab('products')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Catalogue <ChevronRight size={16}/></button>
                        </div>
                        {summary?.topLiked && summary.topLiked.length > 0 ? (
                          <div className="space-y-3">
                              {summary.topLiked.map((p) => (
                                  <div key={p.id} className="flex items-center gap-4 p-3 rounded hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                      <div className="h-12 w-12 rounded bg-slate-100 overflow-hidden shrink-0">
                                          {p.images?.[0] && <img src={getImageUrl(p.images[0].url)} className="h-full w-full object-cover" alt="" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="font-bold text-slate-900 text-sm truncate">{p.title}</p>
                                          <p className="text-xs font-medium text-slate-400">{p.category}</p>
                                      </div>
                                      <div className="text-right shrink-0">
                                          <p className="font-bold text-slate-900 text-sm">FRw {Number(p.price).toLocaleString()}</p>
                                          <div className="flex items-center gap-1 justify-end text-emerald-500 text-xs font-bold">
                                              <ThumbsUp size={12}/> {p.likes}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm text-center py-8">No products yet. Start uploading to see your top performers!</p>
                        )}
                    </div>

                    <div className="bg-white border-2 border-black p-8 rounded flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3">Ready to expand your store?</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">List high-quality products with clear images to increase buyer trust and engagement.</p>
                        </div>
                        <button onClick={() => setActiveTab('upload')} className="w-full py-4 bg-black hover:bg-slate-800 text-white font-bold rounded transition-all shadow-lg mt-6">
                            Create New Listing
                        </button>
                    </div>
                </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Messages from Admin</h3>
                      <button
                        onClick={fetchMessages}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Refresh
                      </button>
                    </div>
                    {messages.length === 0 ? (
                      <p className="text-sm text-slate-500">No messages yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((m) => (
                          <div key={m.id} className={`p-4 rounded border ${m.read ? 'border-slate-200 bg-slate-50' : 'border-blue-200 bg-blue-50/60'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-slate-900">{m.subject || 'Message'}</p>
                                <p className="text-sm text-slate-700 mt-1">{m.body}</p>
                                <p className="text-[11px] text-slate-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
                              </div>
                              {!m.read && (
                                <button
                                  className="text-xs text-blue-600 font-semibold"
                                  onClick={async () => {
                                    await api(`/api/messages/${m.id}/read`, { method: 'POST' });
                                    setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, read: true } : msg));
                                  }}
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Profile Quick View</h3>
                    <div className="flex items-center gap-4">
                      <img src={sellerAvatar} className="h-16 w-16 rounded-full border" alt="avatar"/>
                      <div>
                        <p className="font-bold text-slate-900">{name}</p>
                        <p className="text-sm text-slate-600">{bio || 'No bio yet'}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('profile')} className="mt-4 text-sm font-semibold text-blue-600">Edit profile</button>
                  </div>
                </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Inventory</h1>
                        <p className="text-slate-500 font-medium text-sm">Manage and track your listed products</p>
                    </div>
                    <button onClick={() => setActiveTab('upload')} className="bg-slate-900 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg w-full md:w-auto justify-center md:justify-start">
                        <Plus size={18}/> New Listing
                    </button>
                </div>
                
                {myProducts.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded p-12 md:p-20 text-center">
                        <PackageSearch size={40} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900">Your store is empty</h3>
                        <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">Start uploading products to see them appear in your inventory.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {myProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            {product.images?.[0] ? (
                                <img src={getImageUrl(product.images[0].url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><PackageSearch size={32}/></div>
                            )}
                            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded text-xs font-bold text-slate-900 shadow">
                                FRw {Number(product.price).toLocaleString()}
                            </div>
                        </div>
                        <div className="p-4 md:p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                                    <ThumbsUp size={12}/> {product.likes || 0}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1">{product.title}</h4>
                            <p className="text-slate-500 text-xs line-clamp-2 mb-4 h-8">{product.description}</p>
                            
                            <div className="flex gap-2">
                                <button onClick={() => startEditProduct(product)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-2">
                                    <Edit size={14}/> Edit
                                </button>
                                <button onClick={() => showDeleteConfirm(product.id, product.title)} className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded transition-all border border-slate-100 font-bold" title="Delete product" aria-label="Delete product">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
              </motion.div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <motion.div key="up" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto pb-20">
                    <div className="bg-white rounded border border-slate-200 shadow-sm p-6 md:p-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{editingProductId ? 'Edit Product' : 'List New Product'}</h2>
                            <p className="text-slate-500 mt-2 font-medium text-sm">{editingProductId ? 'Update your listing details.' : 'Complete the details below to publish to the market.'}</p>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Product Title</label>
                                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" placeholder="Product name" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Price (RWF)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">FRw</div>
                                        <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold" placeholder="0" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Category</label>
                                    <select id="category" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium" title="Select product category">
                                        <option value="">Select a category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion & Clothing">Fashion & Clothing</option>
                                        <option value="Home & Garden">Home & Garden</option>
                                        <option value="Books & Media">Books & Media</option>
                                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                                        <option value="Toys & Games">Toys & Games</option>
                                        <option value="Beauty & Health">Beauty & Health</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Vehicles & Accessories">Vehicles & Accessories</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all min-h-[100px] font-medium" placeholder="Describe your product details and condition" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-600 ml-1">Product Images</label>
                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                    {imagePreviews.map((preview, idx) => (
                                      <div key={idx} className="relative group">
                                        <img
                                          src={preview}
                                          alt={`Preview ${idx + 1}`}
                                          className="h-24 w-full object-cover rounded border border-slate-200"
                                        />
                                        <button
                                          type="button"
                                          title="Remove image"
                                          onClick={() => {
                                            const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                                            setImagePreviews(newPreviews);
                                            
                                            // Update files
                                            if (images) {
                                              const dt = new DataTransfer();
                                              for (let i = 0; i < images.length; i++) {
                                                if (i !== idx) dt.items.add(images[i]);
                                              }
                                              setImages(dt.files);
                                            }
                                          }}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="p-8 border-2 border-dashed border-slate-300 rounded bg-slate-50 text-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                                    <div className="h-12 w-12 bg-white rounded shadow border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                                        <UploadCloud size={20} className="text-blue-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">Drop files here or click to browse</p>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 10MB each</p>
                                    {imagePreviews.length > 0 && (
                                      <p className="text-xs text-blue-600 font-semibold mt-2">{imagePreviews.length} image(s) selected</p>
                                    )}
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleImageSelect}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      aria-label="Upload product images"
                                    />
                                </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isUploading}
                              className="w-full py-3 md:py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded transition-all flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                  <>
                                    <div className="animate-spin">⚙️</div> Saving...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={20}/> {editingProductId ? 'Save Changes' : 'Publish Product'}
                                  </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div key="prof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded border border-slate-200 shadow-sm p-6 md:p-8 overflow-hidden relative">
                        <form
                          className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
                          onSubmit={(e) => { e.preventDefault(); setProfileConfirmOpen(true); }}
                        >
                          <div className="shrink-0 w-full md:w-auto">
                            <div className="h-24 w-24 md:h-28 md:w-28 rounded border-4 border-slate-50 shadow overflow-hidden mx-auto md:mx-0">
                              <img src={avatarUrl || sellerAvatar} className="h-full w-full object-cover" alt={user?.name} />
                            </div>
                            <div className="mt-3">
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Profile photo</label>
                              <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-xs text-slate-600"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const formData = new FormData();
                                    formData.append('avatar', file);
                                    const res = await api<{ url: string }>('/api/uploads/avatar', {
                                      method: 'POST',
                                      body: formData,
                                    });
                                    setAvatarUrl(res.url);
                                    show('Photo uploaded. Click Save Changes to apply it.', 'success');
                                  } catch (err: any) {
                                    show(err.message || 'Failed to upload photo', 'error');
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              className="w-full text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 focus:border-blue-400 outline-none bg-transparent"
                            />
                            <input
                              type="text"
                              value={bio}
                              onChange={e => setBio(e.target.value)}
                              placeholder="Bio"
                              className="w-full text-slate-600 font-medium text-sm border-b border-slate-200 focus:border-blue-400 outline-none bg-transparent"
                            />
                            <p className="text-slate-600 font-medium text-sm">{user?.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-3">
                              <div className="px-4 py-1.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 flex items-center gap-2">
                                <Clock size={13} />
                                Joined{' '}
                                {user?.createdAt
                                  ? new Date(user.createdAt).toLocaleString()
                                  : '-'}
                              </div>
                              <div className="px-4 py-1.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 flex items-center gap-2">
                                {user?.phone || 'No phone set'}
                              </div>
                            </div>
                            <button type="submit" className="mt-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold">Save Changes</button>
                          </div>
                        </form>
                        <form
                          className="mt-8"
                          onSubmit={(e) => { e.preventDefault(); setPasswordConfirmOpen(true); }}
                        >
                          <div className="flex flex-col gap-2">
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Current password" className="border rounded p-2" />
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="border rounded p-2" />
                            <button type="submit" className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold">Change Password</button>
                          </div>
                        </form>
                     </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function SidebarLink({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Icon size={18} className={`${active ? 'text-blue-400' : 'group-hover:text-slate-900'}`} />
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-300 transition-all duration-200">
            <div className={`h-14 w-14 rounded ${bg} ${color} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}
