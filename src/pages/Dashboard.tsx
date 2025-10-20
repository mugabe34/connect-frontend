import { useState } from 'react';
import { motion } from 'framer-motion';
// Import icons for a professional dashboard look
import { UploadCloud, ListChecks, Lightbulb, TrendingUp, DollarSign, Tag, Text, Image, CheckCircle } from 'lucide-react';

// Define a placeholder primary color for better style consistency
// I'll use 'teal' for a modern, trustworthy business feel.
const PRIMARY_COLOR = 'teal';

export function Dashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

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
            <motion.form
              onSubmit={submit}
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xl shadow-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-2xl font-bold mb-6 text-${PRIMARY_COLOR}-600 border-b border-${PRIMARY_COLOR}-100 pb-3 flex items-center gap-2`}>
                <UploadCloud className='w-6 h-6' />
                Upload New Product
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Text className='w-4 h-4 text-gray-400' />
                    Product Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
                    placeholder="e.g., Apple iPhone 15 Pro Max"
                    required
                  />
                </div>
                
                {/* Price Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <DollarSign className='w-4 h-4 text-gray-400' />
                    Price ($)
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
                    placeholder="e.g., 999.00"
                    required
                  />
                </div>
                
                {/* Category Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Tag className='w-4 h-4 text-gray-400' />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm appearance-none bg-white focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
                    required
                  >
                    <option value="" disabled>-- Select Category --</option>
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Fashion</option>
                  </select>
                </div>
                
                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <Image className='w-4 h-4 text-gray-400' />
                    Product Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-${PRIMARY_COLOR}-50 file:text-${PRIMARY_COLOR}-700 hover:file:bg-${PRIMARY_COLOR}-100 cursor-pointer transition duration-300`}
                  />
                </div>
                
                {/* Description Field */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-1">
                    <ListChecks className='w-4 h-4 text-gray-400' />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm min-h-[140px] focus:border-${PRIMARY_COLOR}-500 focus:ring-2 focus:ring-${PRIMARY_COLOR}-100 transition duration-200`}
                    placeholder="Describe your product in detail..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-3 border-t border-gray-100 mt-6">
                <motion.button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full bg-${PRIMARY_COLOR}-600 text-white font-bold hover:bg-${PRIMARY_COLOR}-700 shadow-lg shadow-${PRIMARY_COLOR}-200 transform hover:scale-[1.02] transition duration-300`}
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

            {/* 2. Your Listings Card */}
            <motion.div
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-800">Your Active Listings</h3>
              <p className="text-gray-500 italic">No listings yet. Start by uploading your first product above!</p>
            </motion.div>
          </div>

          {/* --- */}

          {/* Sidebar Column: Tips and Quick Actions */}
          <aside className="space-y-6">
            
            {/* Tips Card */}
            <div className="bg-white border border-yellow-300/50 rounded-xl p-5 shadow-lg shadow-yellow-100/50">
              <h3 className={`text-lg font-bold mb-3 text-yellow-700 flex items-center gap-2`}>
                <Lightbulb className='w-5 h-5 fill-yellow-400 text-yellow-500' />
                Pro-Tips for Selling
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Use crystal-clear, high-resolution photos.</li>
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Research and set a competitive, fair price.</li>
                <li className='flex items-start gap-2'><span className={`text-${PRIMARY_COLOR}-500 font-bold`}>•</span> Include detailed descriptions, mentioning flaws.</li>
              </ul>
            </div>
            
            {/* Quick Actions Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Quick Actions</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                <motion.button
                  className={`px-4 py-2 rounded-full border border-${PRIMARY_COLOR}-300 text-${PRIMARY_COLOR}-600 bg-${PRIMARY_COLOR}-50 hover:bg-${PRIMARY_COLOR}-100 transition duration-300 font-medium text-sm`}
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