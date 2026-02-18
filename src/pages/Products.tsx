import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../components/Toast';
import type { Product } from '../types';
import { Search, ChevronDown, MapPin } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [displayItems, setDisplayItems] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'location'>('newest');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { show } = useToast();
  const [buyerLocation, setBuyerLocation] = useState<string>(user?.location || '');

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      show('Please sign in as a buyer to browse products.', 'info');
      navigate('/auth/buyer', { replace: true });
    }
  }, [user, show, navigate]);

  useEffect(() => {
    async function load() {
      try {
        let url = '/api/products';
        if (user?.role === 'seller') {
          url = `/api/products/seller/${user.id}`;
        } else {
          const params = new URLSearchParams();
          if (q) params.set('q', q);
          if (category) params.set('category', category);
          const qs = params.toString();
          if (qs) url += `?${qs}`;
        }
        const data = await api<Product[]>(url);
        setItems(data);

        if (user?.role !== 'seller') {
          try {
            const liked = await api<Product[]>('/api/products/liked/me');
            setLikedProducts(new Set(liked.map(p => p.id)));
          } catch (err) {
            console.error('Failed to load liked products', err);
          }
        }
      } catch {
        show('Failed to load products', 'error');
      }
    }
    load();
  }, [q, category, user]);

  useEffect(() => {
    const sorted = [...items];

    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'location' && buyerLocation) {
      sorted.sort((a, b) => {
        const aMatch = a.seller?.location === buyerLocation ? 0 : 1;
        const bMatch = b.seller?.location === buyerLocation ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return (b.likes || 0) - (a.likes || 0);
      });
    } else {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    setDisplayItems(sorted);
  }, [items, sortBy, buyerLocation]);

  const handleLikeUpdate = (id: string, liked: boolean) => {
    if (liked) {
      setLikedProducts(prev => new Set([...prev, id]));
    } else {
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-max">
        <div className="mb-8 pb-4 border-b border-slate-200">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-sky-800 tracking-tight">
              Discover Products
            </h1>
            <p className="text-lg text-slate-600 mt-1">
              Browse trusted listings and connect with local sellers instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-2 relative">
               <label htmlFor="search-input" className="sr-only">Search products</label>
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
               <input
                 id="search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full border border-slate-300 rounded px-4 py-3 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition font-medium"
                placeholder="Search products"
              />
            </div>

            <div className="relative">
               <label htmlFor="category-select" className="sr-only">Category</label>
               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
               <select
                 id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded px-4 py-3 appearance-none shadow-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition font-medium"
              >
                <option value="">All categories</option>
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

            {user?.role !== 'seller' && (
              <>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setSortBy('newest')}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-3 rounded font-semibold text-sm transition-all ${
                      sortBy === 'newest'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    Newest
                  </motion.button>
                  <motion.button
                    onClick={() => setSortBy('popular')}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-3 rounded font-semibold text-sm transition-all ${
                      sortBy === 'popular'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    Popular
                  </motion.button>
                </div>

                <div className="relative">
                   <label htmlFor="location-select" className="sr-only">Select district</label>
                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                   <select
                     id="location-select"
                    value={buyerLocation}
                    onChange={(e) => setBuyerLocation(e.target.value)}
                    className="w-full border border-slate-300 rounded px-4 py-3 pl-10 appearance-none shadow-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition font-medium"
                  >
                    <option value="">Select district</option>
                    <optgroup label="Kigali City">
                      <option>Gasabo</option>
                      <option>Kicukiro</option>
                      <option>Nyarugenge</option>
                    </optgroup>
                    <optgroup label="Eastern Province">
                      <option>Bugesera</option>
                      <option>Gatsibo</option>
                    </optgroup>
                    <optgroup label="Western Province">
                      <option>Rubavu</option>
                      <option>Rusizi</option>
                    </optgroup>
                  </select>
                </div>

                {buyerLocation && (
                  <motion.button
                    onClick={() => setSortBy('location')}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      sortBy === 'location'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    Near me
                  </motion.button>
                )}
              </>
            )}
          </div>
        </div>

        {displayItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl font-semibold text-slate-900">No products found</p>
            <p className="text-slate-600 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {displayItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={likedProducts.has(product.id)}
                onLike={handleLikeUpdate}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
