import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Heart,
  MapPin,
  LayoutGrid,
  UserCircle,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { api, getImageUrl } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import type { Product, User } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../components/Toast';

type Tab = 'browse' | 'saved' | 'profile';

const DISTRICTS = [
  'Gasabo',
  'Kicukiro',
  'Nyarugenge',
  'Bugesera',
  'Gatsibo',
  'Kayonza',
  'Kirehe',
  'Ngoma',
  'Nyagatare',
  'Rwamagana',
  'Burera',
  'Gakenke',
  'Gicumbi',
  'Musanze',
  'Rulindo',
  'Gisagara',
  'Huye',
  'Kamonyi',
  'Muhanga',
  'Nyamagabe',
  'Nyanza',
  'Nyaruguru',
  'Ruhango',
  'Karongi',
  'Ngororero',
  'Nyabihu',
  'Nyamasheke',
  'Rubavu',
  'Rusizi',
  'Rutsiro',
];

const CATEGORIES = [
  'Electronics',
  'Fashion & Clothing',
  'Home & Garden',
  'Books & Media',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Health',
  'Furniture',
  'Vehicles & Accessories',
  'Other',
];

export function BuyerDashboard() {
  const { user, setUser, logout } = useAuth();
  const { show } = useToast();

  const [tab, setTab] = useState<Tab>('browse');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'nearby'>('recent');

  // Profile
  const [profile, setProfile] = useState<Partial<User>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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

  // Initial load
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
        setProducts(allProducts);
        setLikedProducts(saved);
        setLikedIds(new Set(saved.map((p) => p.id)));
      } catch (err: any) {
        show(err.message || 'Failed to load products', 'error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [show]);

  // Filtered list
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
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(buyerName)}&background=0f172a&color=ffffff`;

  const handleLikeUpdate = (id: string, liked: boolean) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(id);
      else next.delete(id);
      return next;
    });

    const product = products.find((p) => p.id === id);
    if (!product) return;
    setLikedProducts((prev) => {
      if (liked) {
        if (prev.find((p) => p.id === id)) return prev;
        return [product, ...prev];
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setLocation(user?.location || '');
    setSortBy('recent');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
              <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500 flex items-center gap-2">
                Buyer Dashboard
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Verified access
                </span>
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back, <span className="font-bold text-sky-700">{buyerName}</span>
              </h1>
              <p className="text-sm text-slate-600">Search, save, and manage your buyer profile.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab('profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-sky-300 shadow-sm"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 mb-6">
          {[
            { id: 'browse', label: 'Browse Products', icon: LayoutGrid },
            { id: 'saved', label: 'Saved', icon: Heart },
            { id: 'profile', label: 'Profile', icon: UserCircle },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as Tab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                  active
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mb-6" />

        {/* Filters for browse tab */}
        {tab === 'browse' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-5 mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pl-10 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  placeholder="Search products or sellers"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pl-10 appearance-none shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pl-10 appearance-none shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                >
                  <option value="">Any location</option>
                  {DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                {(['recent', 'popular', 'nearby'] as const).map((s) => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSortBy(s)}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition ${
                      sortBy === s
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    {s === 'recent' ? 'Newest' : s === 'popular' ? 'Popular' : 'Near me'}
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:col-span-2 lg:col-span-1">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLocation(user?.location || '')}
                  className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold w-full"
                >
                  Use my location
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold w-full"
                >
                  <RefreshCw className="h-4 w-4 inline-block mr-2" />
                  Reset
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {tab === 'browse' && (
          <div>
            {isLoading ? (
              <div className="text-center py-16 text-slate-600">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-3">📭</div>
                <p className="text-xl font-semibold text-slate-900">No products found</p>
                <p className="text-slate-600 mt-1">Try adjusting your search or filters.</p>
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
                  <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                    <ProductCard
                      product={product}
                      isLiked={likedIds.has(product.id)}
                      onLike={handleLikeUpdate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            {likedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-3">💙</div>
                <p className="text-xl font-semibold text-slate-900">No saved products yet</p>
                <p className="text-slate-600 mt-1">Browse and tap the heart icon to save items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {likedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLiked={true}
                    onLike={handleLikeUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Account</p>
                <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-600">Update your info to get better local matches.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[220px,1fr]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={
                      profile.avatarUrl
                        ? getImageUrl(profile.avatarUrl)
                        : avatarUrl
                    }
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <label className="cursor-pointer px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold hover:border-sky-300 bg-white">
                  Change photo
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Full name</label>
                  <input
                    value={profile.name || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    value={profile.email || ''}
                    readOnly
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <input
                    value={(profile as any).phone || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="WhatsApp phone"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Location</label>
                  <select
                    value={profile.location || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  onClick={saveProfile}
                  disabled={isSavingProfile}
                  className="px-5 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
