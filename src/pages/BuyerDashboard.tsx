import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  MapPin,
  LayoutGrid,
  UserCircle,
  LogOut,
  Package,
  Bookmark,
  TrendingUp,
  ChevronRight,
  Clock,
  SlidersHorizontal,
  Camera,
  ShoppingBag,
  Signal,
  Wifi,
  BatteryFull,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { api, getImageUrl } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import type { Product, User } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../components/Toast';

type Tab = 'browse' | 'saved' | 'profile';

const DISTRICTS = [
  'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Gatsibo',
  'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango', 'Karongi', 'Ngororero',
  'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro',
];

const CATEGORIES = [
  'Electronics', 'Fashion & Clothing', 'Home & Garden',
  'Books & Media', 'Sports & Outdoors', 'Toys & Games',
  'Beauty & Health', 'Furniture', 'Vehicles & Accessories', 'Other',
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export function BuyerDashboard() {
  const { user, setUser, logout } = useAuth();
  const { show } = useToast();
  const showRef = useRef(show);
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('browse');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'nearby'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const [profile, setProfile] = useState<Partial<User>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: (user as any).phone || '',
        location: user.location,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      show('Please sign in as a buyer to access your dashboard.', 'info');
      navigate('/auth/buyer', { replace: true });
    }
  }, [user, show, navigate]);

  useEffect(() => {
    showRef.current = show;
  }, [show]);

  useEffect(() => {
    const timer = setInterval(() => setTime(formatTime()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const [allProducts, saved] = await Promise.all([
          api<Product[]>('/api/products?limit=200'),
          api<Product[]>('/api/products/liked/me'),
        ]);
        if (!mounted) return;
        const isConnectable = (p: Product) =>
          !!p?.seller && (!!p?.contact?.phone || !!p?.contact?.email);
        const visibleProducts = allProducts.filter(isConnectable);
        const visibleSaved = saved.filter(isConnectable);
        setProducts(visibleProducts);
        setLikedProducts(visibleSaved);
        setLikedIds(new Set(visibleSaved.map((p) => p.id)));
      } catch (err: any) {
        showRef.current(err.message || 'Failed to load products', 'error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const loc = location.trim();
    let list = products.filter((p) => {
      const matchesTerm =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.seller?.name?.toLowerCase().includes(term);
      const matchesCategory = !category || p.category === category;
      const matchesLocation = !loc || p.location === loc || p.seller?.location === loc;
      return matchesTerm && matchesCategory && matchesLocation;
    });

    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'nearby' && location) {
      list = [...list].sort((a, b) => {
        const aNear = a.location === location || a.seller?.location === location ? 0 : 1;
        const bNear = b.location === location || b.seller?.location === location ? 0 : 1;
        if (aNear !== bNear) return aNear - bNear;
        return (b.likes || 0) - (a.likes || 0);
      });
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    }
    return list;
  }, [products, searchTerm, category, location, sortBy]);

  const buyerName = user?.name || 'Buyer';
  const withVersion = (url: string, version?: string) =>
    version ? `${url}${url.includes('?') ? '&' : '?'}v=${version}` : url;
  const avatarUrl = (user as any)?.avatarUrl
    ? withVersion(getImageUrl((user as any).avatarUrl), user?.updatedAt ? encodeURIComponent(user.updatedAt) : undefined)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(buyerName)}&background=1d4ed8&color=ffffff`;

  const handleLikeUpdate = (id: string, liked: boolean) => {
    setLikedIds((prev) => {
      const wasLiked = prev.has(id);
      if (wasLiked === liked) return prev;
      const likesDelta = liked ? 1 : -1;
      const next = new Set(prev);
      if (liked) next.add(id);
      else next.delete(id);

      setProducts((prevProducts) => {
        let updatedProduct: Product | undefined;
        const nextProducts = prevProducts.map((p) => {
          if (p.id !== id) return p;
          updatedProduct = { ...p, likes: Math.max(0, (p.likes || 0) + likesDelta) };
          return updatedProduct;
        });

        setLikedProducts((prevLiked) => {
          if (liked) {
            if (prevLiked.some((p) => p.id === id)) {
              return prevLiked.map((p) =>
                p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + likesDelta) } : p
              );
            }
            return updatedProduct ? [updatedProduct, ...prevLiked] : prevLiked;
          }
          return prevLiked.filter((p) => p.id !== id);
        });

        return nextProducts;
      });

      return next;
    });
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await api<{ user: User }>('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: (profile as any).phone,
          location: profile.location,
          avatarUrl: profile.avatarUrl,
        }),
      });
      setUser(res.user);
      show('Profile updated', 'success');
    } catch (err: any) {
      show(err.message || 'Could not update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api<{ url: string }>('/api/uploads/avatar', {
      method: 'POST',
      body: formData,
    });
    setProfile((prev) => ({ ...prev, avatarUrl: res.url }));
  };

  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: products.length,
      accent: 'text-blue-400',
      glow: 'shadow-blue-500/10',
    },
    {
      icon: Bookmark,
      label: 'Saved Items',
      value: likedProducts.length,
      accent: 'text-rose-400',
      glow: 'shadow-rose-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Active Now',
      value: Math.min(products.length, 128),
      accent: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06060a] via-[#0a0e17] to-[#06060a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col min-h-screen">
        {/* Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 tracking-wide mb-2 -mt-4 sm:-mt-6">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#0a0e17] bg-slate-800">
              <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-gray-500 flex items-center gap-2">
                Buyer Dashboard
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Verified
                </span>
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  {buyerName}
                </span>
              </h1>
              <p className="text-sm text-gray-500">Search, save, and manage your buyer profile.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab('profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-gray-300 hover:text-white hover:bg-white/[0.08] font-semibold"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25"
            >
              OK
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`glass-card p-4 ${stat.glow} hover:bg-white/[0.08] transition-all cursor-default`}
              >
                <Icon className={`h-5 w-5 ${stat.accent} mb-2`} />
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'browse', label: 'Browse Products', icon: LayoutGrid },
            { id: 'saved', label: 'Saved', icon: Heart },
            { id: 'profile', label: 'Profile', icon: UserCircle },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id as Tab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'glass text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <AnimatePresence mode="wait">
            {/* Browse Tab */}
            {tab === 'browse' && (
              <motion.div
                key="browse"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-4"
              >
                {/* Search + Filters */}
                <motion.div variants={item} className="glass-card p-4 md:p-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input pl-10 w-full"
                        placeholder="Search products or sellers"
                      />
                    </div>
                    <div className="relative">
                      <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="glass-select pl-10 w-full"
                      >
                        <option value="" className="bg-gray-900">All categories</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} className="bg-gray-900">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="glass-select pl-10 w-full"
                      >
                        <option value="" className="bg-gray-900">Any location</option>
                        {DISTRICTS.map((d) => (
                          <option key={d} className="bg-gray-900">{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex gap-2">
                      {(['recent', 'popular', 'nearby'] as const).map((s) => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSortBy(s)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-0 transition-all ${
                            sortBy === s
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                              : 'glass text-gray-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          {s === 'recent' ? 'Newest' : s === 'popular' ? 'Popular' : 'Near me'}
                        </motion.button>
                      ))}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLocation(user?.location || '')}
                      className="px-4 py-2.5 rounded-xl glass text-emerald-400 font-semibold hover:bg-white/[0.08] transition-all text-sm"
                    >
                      <MapPin className="h-3.5 w-3.5 inline mr-1.5" />
                      Use my location
                    </motion.button>
                  </div>
                </motion.div>

                {/* Product Grid */}
                <motion.div variants={item}>
                  {isLoading ? (
                    <div className="text-center py-16">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
                      />
                      <p className="text-sm text-gray-500 mt-4">Loading products...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-4 opacity-50">🔍</div>
                      <p className="text-xl font-semibold">No products found</p>
                      <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                        },
                      }}
                    >
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        >
                          <ProductCard
                            product={product}
                            isLiked={likedIds.has(product.id)}
                            onLike={handleLikeUpdate}
                            variant="dark"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Saved Tab */}
            {tab === 'saved' && (
              <motion.div
                key="saved"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {likedProducts.length === 0 ? (
                  <motion.div variants={item} className="text-center py-16">
                    <div className="text-4xl mb-4 opacity-50">💙</div>
                    <p className="text-xl font-semibold">No saved products yet</p>
                    <p className="text-gray-500 mt-1">Browse and tap the heart icon to save items.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                      },
                    }}
                  >
                    {likedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                      >
                        <ProductCard
                          product={product}
                          isLiked={true}
                          onLike={handleLikeUpdate}
                          variant="dark"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <motion.div
                key="profile"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-6"
              >
                {/* Profile Card */}
                <motion.div variants={item} className="glass-card p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Account</p>
                      <h2 className="text-2xl font-bold">Profile</h2>
                      <p className="text-sm text-gray-500">Update your info to get better local matches.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[220px,1fr]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <div className="h-28 w-28 rounded-full overflow-hidden ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#0a0e17] bg-slate-800">
                          <img
                            src={profile.avatarUrl ? getImageUrl(profile.avatarUrl) : avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                          <Camera className="h-6 w-6 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  await uploadAvatar(file);
                                  show('Avatar uploaded. Save to apply.', 'success');
                                } catch (err: any) {
                                  show(err.message || 'Upload failed', 'error');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <input
                          value={profile.name || ''}
                          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                          className="glass-input mt-1.5"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                        <input
                          value={profile.email || ''}
                          readOnly
                          className="glass-input mt-1.5 opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                        <input
                          value={(profile as any).phone || ''}
                          onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                          className="glass-input mt-1.5"
                          placeholder="WhatsApp phone"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                        <select
                          value={profile.location || ''}
                          onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                          className="glass-select mt-1.5"
                        >
                          <option value="" className="bg-gray-900">Select district</option>
                          {DISTRICTS.map((d) => (
                            <option key={d} className="bg-gray-900">{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3">
                      <button
                        onClick={saveProfile}
                        disabled={isSavingProfile}
                        className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Sign Out */}
                <motion.div variants={item}>
                  <button
                    onClick={logout}
                    className="w-full py-3 rounded-xl glass text-rose-400 hover:bg-rose-500/10 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
