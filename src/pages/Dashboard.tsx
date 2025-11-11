<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../providers/AuthProvider';
import { Product } from '../types';
import { UploadCloud, ListChecks, Lightbulb, TrendingUp, DollarSign, Tag, Text, Image, CheckCircle } from 'lucide-react';

=======
import { useState } from 'react';
import { motion } from 'framer-motion';
// Import icons for a professional dashboard look
import { UploadCloud, ListChecks, Lightbulb, TrendingUp, DollarSign, Tag, Text, Image, CheckCircle } from 'lucide-react';

// Define a placeholder primary color for better style consistency
// I'll use 'teal' for a modern, trustworthy business feel.
const PRIMARY_COLOR = 'teal';

>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
export function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
<<<<<<< HEAD
  const [images, setImages] = useState<FileList | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  async function fetchMyProducts() {
    if (user) {
      api<Product[]>(`/api/products/seller/${user.id}`).then(setMyProducts);
    }
  }

  useEffect(() => {
    fetchMyProducts();
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!images) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await api('/api/products', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product created successfully!');
      fetchMyProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to create product.');
    }
  }

  return (
    <div className={`bg-gray-50 min-h-screen py-10`}>
      <div className="container-max">
        <h1 className={`text-4xl font-extrabold mb-8 text-teal-800 tracking-tight flex items-center gap-3`}>
          <TrendingUp className={`h-8 w-8 text-teal-500`} />
          Seller Dashboard
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
=======

  function submit(e: React.FormEvent) {
    e.preventDefault();
    alert(`Upload stub: ${title} / ${price} / ${category}`);
  }

  return (
    // Outer container with a subtle background for depth
    <div className={`bg-gray-50 min-h-screen py-10`}>
      <div className="container-max">
        <h1 className={`text-4xl font-extrabold mb-8 text-${PRIMARY_COLOR}-800 tracking-tight flex items-center gap-3`}>
          <TrendingUp className={`h-8 w-8 text-${PRIMARY_COLOR}-500`} />
          Seller Dashboard
        </h1>
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Column: Listing Form and Listings */}
          <div className="md:col-span-2 space-y-8">
            
            {/* 1. New Listing Form */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
            <motion.form
              onSubmit={submit}
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
<<<<<<< HEAD
              <h2 className={`text-2xl font-bold mb-6 text-teal-600 border-b border-teal-100 pb-3 flex items-center gap-2`}>
=======
              <h2 className={`text-2xl font-bold mb-6 text-${PRIMARY_COLOR}-600 border-b border-${PRIMARY_COLOR}-100 pb-3 flex items-center gap-2`}>
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <UploadCloud className='w-6 h-6' />
                Upload New Product
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
<<<<<<< HEAD
=======
                
                {/* Title Field */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Text className='w-4 h-4 text-gray-400' />
                    Product Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
<<<<<<< HEAD
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition duration-200`}
=======
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                    placeholder="e.g., Apple iPhone 15 Pro Max"
                    required
                  />
                </div>
<<<<<<< HEAD
=======
                
                {/* Price Field */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <DollarSign className='w-4 h-4 text-gray-400' />
                    Price ($)
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
<<<<<<< HEAD
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition duration-200`}
=======
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                    placeholder="e.g., 999.00"
                    required
                  />
                </div>
<<<<<<< HEAD
=======
                
                {/* Category Field */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Tag className='w-4 h-4 text-gray-400' />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
<<<<<<< HEAD
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm appearance-none bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition duration-200`}
=======
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm appearance-none bg-white focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                    required
                  >
                    <option value="" disabled>-- Select Category --</option>
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Fashion</option>
                  </select>
                </div>
<<<<<<< HEAD
=======
                
                {/* Images Upload */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Image className='w-4 h-4 text-gray-400' />
                    Product Images
                  </label>
                  <input
                    type="file"
                    multiple
<<<<<<< HEAD
                    onChange={(e) => setImages(e.target.files)}
                    className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer transition duration-300`}
                  />
                </div>
=======
                    className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-${PRIMARY_COLOR}-50 file:text-${PRIMARY_COLOR}-700 hover:file:bg-${PRIMARY_COLOR}-100 cursor-pointer transition duration-300`}
                  />
                </div>
                
                {/* Description Field */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <ListChecks className='w-4 h-4 text-gray-400' />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm min-h-[140px] focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition duration-200`}
=======
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm min-h-[140px] focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                    placeholder="Describe your product in detail..."
                  />
                </div>
              </div>

<<<<<<< HEAD
              <div className="pt-6 flex gap-3 border-t border-gray-100 mt-6">
                <motion.button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transform hover:scale-[1.02] transition duration-300`}
=======
              {/* Action Buttons */}
              <div className="pt-6 flex gap-3 border-t border-gray-100 mt-6">
                <motion.button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full bg-${PRIMARY_COLOR}-600 text-white font-bold hover:bg-${PRIMARY_COLOR}-700 shadow-lg shadow-${PRIMARY_COLOR}-200 transform hover:scale-[1.02] transition duration-300`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className='w-5 h-5' />
                  Upload Listing
                </motion.button>
                <motion.button
                  type="button"
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-100 transition duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Draft
                </motion.button>
              </div>
            </motion.form>

<<<<<<< HEAD
=======
            {/* 2. Your Listings Card */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
            <motion.div
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-800">Your Active Listings</h3>
<<<<<<< HEAD
              {myProducts.length === 0 ? (
                <p className="text-gray-500 italic">No listings yet. Start by uploading your first product above!</p>
              ) : (
                <div className="space-y-4">
                  {myProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-2 border-b">
                      <span>{product.title}</span>
                      <span>${product.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <aside className="space-y-6">
=======
              <p className="text-gray-500 italic">No listings yet. Start by uploading your first product above!</p>
            </motion.div>
          </div>

          {/* --- */}

          {/* Sidebar Column: Tips and Quick Actions */}
          <aside className="space-y-6">
            
            {/* Tips Card */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
            <div className="bg-white border border-yellow-300/50 rounded-xl p-5 shadow-lg shadow-yellow-100/50">
              <h3 className={`text-lg font-bold mb-3 text-yellow-700 flex items-center gap-2`}>
                <Lightbulb className='w-5 h-5 fill-yellow-400 text-yellow-500' />
                Pro-Tips for Selling
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
<<<<<<< HEAD
                <li className='flex items-start gap-2'><span className={`text-teal-500 font-bold`}>•</span> Use crystal-clear, high-resolution photos.</li>
                <li className='flex items-start gap-2'><span className={`text-teal-500 font-bold`}>•</span> Research and set a competitive, fair price.</li>
                <li className='flex items-start gap-2'><span className={`text-teal-500 font-bold`}>•</span> Include detailed descriptions, mentioning flaws.</li>
              </ul>
            </div>
=======
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Use crystal-clear, high-resolution photos.</li>
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Research and set a competitive, fair price.</li>
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Include detailed descriptions, mentioning flaws.</li>
              </ul>
            </div>
            
            {/* Quick Actions Card */}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Quick Actions</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                <motion.button
<<<<<<< HEAD
                  className={`px-4 py-2 rounded-full border border-teal-300 text-teal-600 bg-teal-50 hover:bg-teal-100 transition duration-300 font-medium text-sm`}
=======
                  className={`px-4 py-2 rounded-full border border-${PRIMARY_COLOR}-300 text-${PRIMARY_COLOR}-600 bg-${PRIMARY_COLOR}-50 hover:bg-${PRIMARY_COLOR}-100 transition duration-300 font-medium text-sm`}
>>>>>>> a5b9a33e48dc9b7d776d2bc92e8c0d89ff4f2f59
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create New Listing
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 transition duration-300 font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Analytics
                </motion.button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}