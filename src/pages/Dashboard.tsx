import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import type { Product } from '../types';
import conlogo from '../assets/conlogo.png';
import {
  UploadCloud,
  DollarSign,
  PackageSearch,
  Plus,
  UserCircle2,
  MessageSquare,
  Trash2,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  TrendingUp,
  ThumbsUp,
  Clock,
  CheckCircle2,
  MoreVertical,
  Layers
} from 'lucide-react';

type DashboardTab = 'overview' | 'products' | 'upload' | 'profile';

export function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [summary, setSummary] = useState<{
    totalProducts: number;
    totalLikes: number;
    approvedProducts: number;
    pendingProducts: number;
    topLiked: Product[];
  } | null>(null);
  
  const { user, logout } = useAuth();

  // Logic: Fetching
  async function fetchMyProducts() {
    if (!user) return;
    try {
      const products = await api<Product[]>(`/api/products/seller/${user.id}`);
      setMyProducts(products);
    } catch (err) { console.error('Failed to fetch products', err); }
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
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !category) return alert('Please fill required fields');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    if (user) {
        formData.append('contactEmail', user.email);
        if (user.phone) formData.append('contactPhone', user.phone);
    }
    if (images) {
      for (let i = 0; i < images.length; i++) formData.append('images', images[i]);
    }

    try {
      await api('/api/products', { method: 'POST', body: formData });
      alert('Product published successfully!');
      setTitle(''); setPrice(''); setCategory(''); setDescription(''); setImages(null);
      setActiveTab('products');
      fetchMyProducts();
    } catch (error) { alert('Failed to create product.'); }
  }

  const handleWhatsApp = (phone?: string, title?: string) => {
    if (!phone) return;
    const msg = `Hello, I'm interested in: ${title}`;
    window.open(`https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const sellerAvatar = (user as any)?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'S')}&background=0f172a&color=fff`;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar Redesign */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col py-8 px-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src={conlogo} alt="Logo" className="h-9 w-auto" />
          <span className="font-bold text-xl tracking-tight text-slate-800">Connect</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarLink icon={PackageSearch} label="My Inventory" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarLink icon={Plus} label="Add Product" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
          <SidebarLink icon={UserCircle2} label="Store Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200">
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 px-8 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Workspace</span>
              <h2 className="text-sm font-bold text-slate-700">{user?.name}’s Store</h2>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 p-1 pr-3 rounded-full border border-slate-200">
                <img src={sellerAvatar} className="h-8 w-8 rounded-full border border-white shadow-sm" alt="avatar" />
                <span className="text-xs font-bold text-slate-600">{user?.email}</span>
            </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-2 text-lg">Performance insights for your active listings.</p>
                </header>

                {/* Stat Cards Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Value" value={`$${myProducts.reduce((acc, p) => acc + Number(p.price), 0)}`} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
                    <StatCard title="Products" value={summary?.totalProducts ?? 0} icon={Layers} color="text-emerald-600" bg="bg-emerald-50" />
                    <StatCard title="Engagement" value={`${summary?.totalLikes ?? 0} Likes`} icon={ThumbsUp} color="text-purple-600" bg="bg-purple-50" />
                    <StatCard title="Approval" value={summary?.approvedProducts ?? 0} icon={CheckCircle2} color="text-sky-600" bg="bg-sky-50" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-xl">Top Performers</h3>
                            <button onClick={() => setActiveTab('products')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Catalogue <ChevronRight size={16}/></button>
                        </div>
                        <div className="space-y-4">
                            {summary?.topLiked.map((p) => (
                                <div key={p.id} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                        {p.images?.[0] && <img src={p.images[0].url} className="h-full w-full object-cover" alt="" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{p.title}</p>
                                        <p className="text-xs font-medium text-slate-400">{p.category}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-slate-900">${p.price}</p>
                                        <div className="flex items-center gap-1 justify-end text-emerald-500 text-xs font-bold">
                                            <ThumbsUp size={12}/> {p.likes}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0f172a] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Plus className="text-sky-400" />
                            </div>
                            <h3 className="text-2xl font-bold leading-tight">Ready to expand your store?</h3>
                            <p className="text-slate-400 mt-4 text-sm leading-relaxed">List high-quality products with clear images to increase buyer trust and engagement.</p>
                        </div>
                        <button onClick={() => setActiveTab('upload')} className="relative z-10 w-full py-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-sky-500/20">
                            Create New Listing
                        </button>
                        <div className="absolute -top-24 -right-24 h-64 w-64 bg-sky-500/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Catalogue</h1>
                        <p className="text-slate-500 font-medium">Manage and track your listed products</p>
                    </div>
                    <button onClick={() => setActiveTab('upload')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                        <Plus size={20}/> New Listing
                    </button>
                </div>
                
                {myProducts.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                        <PackageSearch size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="font-bold text-xl text-slate-900">Your store is empty</h3>
                        <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">Start uploading products to see them appear in your catalogue.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {myProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500">
                        <div className="relative h-64 overflow-hidden">
                            {product.images?.[0] ? (
                                <img src={product.images[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><PackageSearch size={40}/></div>
                            )}
                            <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-slate-900 shadow-sm border border-white/50">
                                ${product.price}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] uppercase font-black tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                    <ThumbsUp size={14}/> {product.likes || 0}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xl mb-2 line-clamp-1">{product.title}</h4>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed h-10">{product.description}</p>
                            
                            <div className="flex gap-3">
                                <button onClick={() => handleWhatsApp(product.contact?.phone, product.title)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2">
                                    <MessageSquare size={16}/> WhatsApp
                                </button>
                                <button onClick={async () => {
                                    if(confirm('Delete listing?')) {
                                        await api(`/api/products/${product.id}`, { method: 'DELETE' });
                                        fetchMyProducts();
                                    }
                                }} className="p-4 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all border border-slate-100">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
              </motion.div>
            )}

            {activeTab === 'upload' && (
                <motion.div key="up" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto pb-20">
                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-12">
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-slate-900">List New Product</h2>
                            <p className="text-slate-500 mt-2 font-medium">Complete the details below to publish to the market.</p>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3 col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Product Title</label>
                                    <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all font-medium" placeholder="Professional name of your product" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Price (USD)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign size={18}/></div>
                                        <input required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:bg-white transition-all font-bold" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                    <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:bg-white transition-all font-bold appearance-none">
                                        <option value="">Select Genre</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home">Home</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Detailed Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:bg-white transition-all min-h-[140px] font-medium" placeholder="Highlight key features and condition..." />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Product Imagery</label>
                                <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 text-center group hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer relative">
                                    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={24} className="text-sky-500" />
                                    </div>
                                    <p className="text-sm font-black text-slate-700">Drop files here or click to browse</p>
                                    <p className="text-xs text-slate-400 mt-2">Support High-res JPG, PNG (Max 10MB)</p>
                                    <input type="file" multiple onChange={(e) => setImages(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 text-lg">
                                <CheckCircle2 size={24}/> Publish to Market
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {activeTab === 'profile' && (
                <motion.div key="prof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
                     <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-12 overflow-hidden relative">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="h-32 w-32 rounded-[2.5rem] border-4 border-slate-50 shadow-xl overflow-hidden shrink-0">
                                <img src={sellerAvatar} className="h-full w-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <span className="text-xs font-black text-sky-600 uppercase tracking-widest">Verified Seller</span>
                                <h2 className="text-4xl font-black text-slate-900">{user?.name}</h2>
                                <p className="text-slate-500 font-medium text-lg">{user?.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                    <div className="px-5 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 flex items-center gap-2">
                                        <Clock size={14}/> Joined 2024
                                    </div>
                                    <div className="px-5 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 flex items-center gap-2">
                                        <MessageSquare size={14}/> {user?.phone || 'No phone set'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <UserCircle2 size={200} />
                        </div>
                     </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// Styled Sub-components
// ----------------------------------------------------------------------

function SidebarLink({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'}`}>
            <Icon size={20} className={`${active ? 'text-sky-400' : 'group-hover:text-slate-900'}`} />
            <span className="font-bold text-sm tracking-tight">{label}</span>
        </button>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-sky-300 transition-all duration-300">
            <div className={`h-16 w-16 rounded-[1.5rem] ${bg} ${color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}