import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import type { Product } from '../types'
import { Users, Package, Star, Search, X, Facebook, Instagram, Twitter } from 'lucide-react'

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [contactInfo, setContactInfo] = useState<{ email: string, phone: string } | null>(null);

  useEffect(() => {
    api<Product[]>('/api/products?featured=true&limit=8').then(setFeaturedProducts);
    api<{ totalUsers: number, totalProducts: number }>('/api/stats').then(setStats);
    api<{ email: string, phone: string }>('/api/contact-info').then(setContactInfo);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-b from-sky-50 via-white to-sky-100/20 text-gray-800 font-sans relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="absolute -right-40 top-1/3 w-96 h-96 rounded-full bg-sky-300/40 blur-3xl pointer-events-none z-0"
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      ></motion.div>

      <section className="relative overflow-hidden z-10">
        <div className="container-max py-20 grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-900">
              Buy and sell locally on <span className="text-sky-600">Connect</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Discover trusted sellers, verified profiles, and great deals near you.
            </p>
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  placeholder="Search products, categories, locations"
                />
              </div>
              <Link
                to="/products"
                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors"
              >
                Search
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/80 backdrop-blur border rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all z-10"
          >
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <Users className="mx-auto text-sky-600 h-6 w-6" />
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">Sellers</div>
              </div>
              <div>
                <Package className="mx-auto text-sky-600 h-6 w-6" />
                <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div>
                <Star className="mx-auto text-yellow-500 h-6 w-6" />
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-gray-500">Trust Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-max py-16 z-10 relative">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Featured Products</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="min-w-[260px] bg-white border rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 cursor-pointer"
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedProduct(product)}
            >
              <div
                className="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${product.images[0]?.url})` }}
              />
              <div className="p-5 space-y-2">
                <div className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">
                  {product.title}
                </div>
                <div className="text-sky-600 font-bold">${product.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <img
              src={selectedProduct.images[0]?.url}
              alt={selectedProduct.title}
              className="rounded-lg mb-4 w-full object-cover h-56"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.title}</h3>
            <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
            <div className="text-sky-600 font-bold text-lg">${selectedProduct.price}</div>
          </motion.div>
        </div>
      )}

      <section className="bg-gradient-to-b from-slate-50 to-white py-16 z-10 relative">
        <div className="container-max">
          <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 tracking-wide">
            What our users say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Great marketplace!', 'Easy to use', 'Trusted sellers'].map((t, i) => (
              <motion.div
                key={i}
                className="bg-white border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="font-semibold text-sky-600 text-lg mb-2 tracking-wide">{t}</div>
                <p className="text-gray-600 italic">
                  “Connect made buying and selling so much easier for me.”
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-max py-16 z-10 relative">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Contact Us</h2>
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border">
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 outline-none transition"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit
            </button>
            <div className="text-center text-sm text-gray-600 mt-3">
              {contactInfo && `📞 ${contactInfo.phone} | ✉️ ${contactInfo.email}`}
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-sky-900 text-white pt-14 pb-6 mt-10 relative z-10">
        <div className="container-max grid md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <p className="text-sky-200 text-sm leading-relaxed">
              Your trusted platform to buy and sell locally with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sky-200 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-lg">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-sky-300 transition"><Facebook /></a>
              <a href="#" className="hover:text-sky-300 transition"><Instagram /></a>
              <a href="#" className="hover:text-sky-300 transition"><Twitter /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-sky-800 w-full mt-8 pt-4 text-sky-200 text-sm text-center">
          © {new Date().getFullYear()} Connect. All rights reserved.
        </div>
      </footer>
    </motion.div>
  )
}
