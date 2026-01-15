import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import type { Product } from '../types';
import { MessageSquare, Heart, UserCircle2, ShoppingBag } from 'lucide-react';

export function BuyerDashboard() {
  const { user, logout } = useAuth();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api<Product[]>('/api/products/liked/me');
        setLikedProducts(data);
      } catch (err) {
        console.error('Failed to load liked products', err);
      }
    }
    load();
  }, []);

  const buyerName = user?.name || 'Buyer';
  const avatarUrl =
    (user as any)?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(buyerName)}&background=0f172a&color=ffffff`;

  const handleWhatsApp = (phone?: string, title?: string) => {
    if (!phone) return;
    const msg = title ? `Hello, I'm interested in your product: ${title}` : 'Hello, I am interested in your product.';
    const url = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Left rail */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col justify-between py-8 px-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-sky-300" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Buyer</p>
              <p className="text-sm font-semibold text-white">Connect Dashboard</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300/90">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-slate-600 bg-slate-800/70 py-2 text-xs font-medium hover:bg-slate-700"
          >
            Logout
          </button>
          <p>Review the products you&apos;ve liked and contact sellers directly.</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <motion.div
          className="max-w-6xl mx-auto flex flex-col gap-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Buyer dashboard</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back, <span className="font-bold">{buyerName}</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View items you&apos;ve liked and keep track of sellers you want to contact.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
                <img src={avatarUrl} alt={buyerName} className="h-full w-full object-cover" />
              </div>
              <div className="text-right leading-tight">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Signed in as</p>
                <p className="text-sm font-semibold text-slate-900">{buyerName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </header>

          {/* Liked products */}
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                  Saved products
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">Items you&apos;ve liked</h2>
              </div>
              <p className="text-xs text-slate-500">
                Total liked:{' '}
                <span className="font-semibold text-slate-800">{likedProducts.length}</span>
              </p>
            </div>

            {likedProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-sm text-slate-600">
                <p className="font-semibold text-slate-900 mb-1">No liked products yet</p>
                <p>
                  Browse the marketplace and tap the heart icon on products you want to remember. They will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {likedProducts.map((product) => (
                  <motion.article
                    key={product.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] flex flex-col"
                  >
                    <div className="relative h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <ShoppingBag className="h-6 w-6" />
                          <span className="text-[11px]">No image uploaded</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-pink-600 border border-pink-200">
                        <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
                        Liked
                      </span>
                    </div>

                    <div className="flex-1 p-4 space-y-2">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {product.description || 'No description provided.'}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                        <span className="truncate max-w-[55%]">
                          Seller: <span className="font-medium text-slate-800">{product.seller?.name}</span>
                        </span>
                        <span className="font-semibold text-sky-600">${product.price}</span>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleWhatsApp(product.contact?.phone, product.title)}
                        disabled={!product.contact?.phone}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/80 bg-emerald-500 text-white text-xs font-medium py-2 shadow-sm hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        WhatsApp seller
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  );
}

