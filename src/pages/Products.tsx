import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// Assuming '../lib/api' exists and works
import { api } from '../lib/api';
// Import necessary icons
import { Search, ChevronDown, Tag, Heart, MessageSquare } from 'lucide-react';

type Product = {
  _id: string;
  title: string;
  price: number;
  description?: string;
  images?: { url: string }[];
  seller?: { name: string };
};

// Define a placeholder primary color (Vibrant Orange for Deals/Activity)
const PRIMARY_COLOR = 'orange';

// Define card variants for a smoother, more deliberate hover animation
const cardVariants = {
  initial: { y: 0, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' },
  hover: {
    y: -8, // Lift the card slightly higher on hover
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Stronger shadow
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Variants for the main content grid entrance
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

// Variants for individual product cards
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};


export function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState('');

  // NOTE: Logic remains unchanged
  async function load() {
    const data = await api<Product[]>(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setItems(data);
  }

  // NOTE: Logic remains unchanged
  useEffect(() => { load() }, [q]); // Added 'q' to dependency array for automatic search on type

  return (
    <div className={`bg-gray-50/50 min-h-screen py-12`}>
      <div className="container-max">
        
        {/* Header and Controls Area */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className={`text-4xl font-extrabold text-${PRIMARY_COLOR}-800 tracking-tight`}>
              Discover Products
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Browse trusted listings and connect with local sellers instantly.
            </p>
          </div>
          
          {/* Search and Filters Block */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={`w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 shadow-inner focus:border-${PRIMARY_COLOR}-500 focus:ring-1 focus:ring-${PRIMARY_COLOR}-500 transition duration-200`}
                placeholder="Search products"
              />
            </div>
            
            {/* Search Button (Explicit click) */}
            <motion.button
              onClick={load}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-${PRIMARY_COLOR}-600 text-black font-semibold hover:bg-${PRIMARY_COLOR}-700 transition duration-300 shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className='h-5 w-5' />
            </motion.button>
            
            {/* Category Select */}
            <div className="relative flex-grow min-w-[150px]">
              <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none' />
              <select className={`w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none shadow-inner bg-white focus:border-${PRIMARY_COLOR}-500 focus:ring-1 focus:ring-${PRIMARY_COLOR}-500 transition duration-200`}>
                <option>All categories</option>
                <option>Electronics</option>
                <option>Home</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {items.map((p) => (
            <motion.div
              key={p._id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-shadow duration-300"
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
            >
              {/* Image Placeholder/Container */}
              <div className="h-44 w-full bg-gray-100 flex items-center justify-center relative group">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <Tag className='h-10 w-10 text-gray-300' />
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-4 space-y-2">
                <div className="font-semibold text-lg line-clamp-1">{p.title}</div>
                <div className={`text-2xl font-extrabold text-${PRIMARY_COLOR}-600`}>
                  ${p.price?.toFixed?.(2) ?? p.price}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100 pt-2">
                  <span className='font-medium'>Seller:</span>
                  <span className='text-gray-700'>{p.seller?.name ?? 'Anonymous'}</span>
                </div>
              </div>
              
              {/* Action Buttons (Hover-to-Show for Modern Feel) */}
              <div className={`p-4 pt-0 flex gap-3 opacity-100 transition duration-300 group-hover:opacity-100`}>
                <motion.button
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-${PRIMARY_COLOR}-200 text-${PRIMARY_COLOR}-600 font-medium text-sm hover:bg-${PRIMARY_COLOR}-50 transition duration-200`}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className='h-4 w-4' /> Contact
                </motion.button>
                <motion.button
                  className={`px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition duration-200`}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Favorite"
                >
                  <Heart className='h-5 w-5' />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}