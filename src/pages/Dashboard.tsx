import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import type { Product } from '../types';
import { UploadCloud, DollarSign, Tag, Image, ListChecks, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  async function fetchMyProducts() {
    if (!user) return;
    try {
      const products = await api<Product[]>(`/api/products/seller/${user.id}`);
      setMyProducts(products);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }

  useEffect(() => {
    fetchMyProducts();
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price || !category) return alert('Please fill required fields');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    if (images) {
      for (let i = 0; i < images.length; i++) formData.append('images', images[i]);
    }

    try {
      await api('/api/products', { method: 'POST', body: formData });
      alert('Product created successfully!');
      setTitle('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImages(null);
      fetchMyProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to create product.');
    }
  }

  const menu = ['connect', 'Top liked', 'products', 'upload product', 'profile'];
  const sellerName = user?.name || 'seller';

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex text-gray-900">
      <aside className="w-60 bg-[#133a7e] text-white flex flex-col justify-between py-10 px-6">
        <div className="space-y-6">
          <span className="inline-flex h-3 w-3 rounded-full bg-white" />
          <div className="space-y-5 text-sm font-semibold tracking-wide uppercase">
            {menu.map((item) => (
              <button key={item} className="block text-left hover:text-sky-200 transition">
                {item}
              </button>
            ))}
          </div>
        </div>
        <span className="inline-flex h-3 w-3 rounded-full bg-white" />
      </aside>

      <main className="flex-1 p-6 md:p-12 relative">
        <motion.div
          className="flex flex-col gap-8 h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                hey, <span className="capitalize">{sellerName}</span> what are we selling today!?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-full border-2 border-gray-800 flex items-center justify-center">
                <span className="text-3xl font-light">◠</span>
              </div>
              <div className="text-right leading-tight">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">sellername</p>
                <p className="text-lg font-semibold">{sellerName}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[380px_1fr] gap-10">
            <motion.form
              onSubmit={submit}
              className="bg-[#1e2b63] text-white rounded-[36px] p-8 flex flex-col gap-6 shadow-xl shadow-[#0b1440]/40"
              transition={{ duration: 0.6 }}
            >
              <div className="h-48 rounded-[32px] border-4 border-[#131b45] bg-[#0f173a] flex flex-col justify-center items-center gap-2">
                <UploadCloud className="w-10 h-10 text-white/80" />
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">product cart</p>
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.4em] text-white/60">product name</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl bg-white text-gray-900 px-4 py-3 text-sm font-semibold focus:outline-none"
                  placeholder="Product title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.4em] text-white/60">price</label>
                  <div className="rounded-2xl bg-white text-gray-900 px-4 py-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.4em] text-white/60">category</label>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Electronics">Electronics</option>
                      <option value="Home">Home</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.4em] text-white/60">description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl bg-white/90 text-gray-900 px-4 py-3 text-sm font-semibold min-h-[90px] focus:outline-none"
                  placeholder="Share the story of your product"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.4em] text-white/60">images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  className="w-full text-sm text-white/90 file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-white file:text-[#1e2b63] file:font-semibold cursor-pointer"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-white text-[#1e2b63] font-bold uppercase tracking-[0.3em] py-3"
              >
                Upload product <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.form>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-white/80 border border-white max-w-2xl w-full shadow-lg px-8 py-10">
                <p className="text-sm uppercase tracking-[0.4em] text-gray-500">product cart</p>
                {myProducts.length === 0 ? (
                  <div className="mt-6 text-gray-600">
                    No listings yet. Your products appear here once uploaded.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {myProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 bg-white"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{product.title}</span>
                          <span className="text-sm text-gray-500">{product.category}</span>
                        </div>
                        <span className="font-bold text-[#1e2b63]">${product.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-dashed border-gray-400 bg-gray-100/80 p-6 text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">Need inspiration?</p>
                <p>
                  Pin your top liked items, edit product cards, or jump to your profile using the left rail. Keep it
                  minimal and focused—just like this workspace.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}