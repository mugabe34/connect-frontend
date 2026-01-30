import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Product } from '../types'
import {
    Users,
    Package,
    Star,
    Search,
    X,
    Facebook,
    Instagram,
    Twitter,
    Upload,
    PhoneCall,
    User
} from 'lucide-react'
import jackets from '../assets/jackets.jpg'
import pants from '../assets/pants.jpg'
import shoes from '../assets/shoes.jpg'
import images from '../assets/images.jpg'
<<<<<<< HEAD
import get_in_touch from '../assets/get_in_touch.png'

const demoImages = [pants, jackets, shoes, images, get_in_touch]
=======
import nike from '../assets/nike.jpeg'
import shirt from '../assets/shirt.jpeg'
import photo1 from '../assets/1.png'
import photo2 from '../assets/2.png'

const demoImages = [pants, jackets, shoes, images, nike]
const clothesSlideImages = [shirt, shoes, nike, jackets, pants]
>>>>>>> a421124 (Initial commit with About page)

function useAnimatedCounter(to: number, duration = 2000) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const step = Math.ceil(to / (duration / 16))
        const interval = setInterval(() => {
            start += step
            if (start >= to) {
                setCount(to)
                clearInterval(interval)
            } else setCount(start)
        }, 16)
        return () => clearInterval(interval)
    }, [to, duration])
    return count
}

export function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
<<<<<<< HEAD
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0 })
=======
>>>>>>> a421124 (Initial commit with About page)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [contactInfo, setContactInfo] = useState<{ email: string; phone: string } | null>(null)

    const buyers = useAnimatedCounter(1500000, 2000)
    const sellers = useAnimatedCounter(1000, 2000)
    const products = useAnimatedCounter(2756, 2000)

    useEffect(() => {
        api<Product[]>('/api/products?featured=true&limit=8').then(setFeaturedProducts)
<<<<<<< HEAD
        api<{ totalUsers: number; totalProducts: number }>('/api/stats').then(setStats)
=======
>>>>>>> a421124 (Initial commit with About page)
        api<{ email: string; phone: string }>('/api/contact-info').then(setContactInfo)
    }, [])

    const [slide, setSlide] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((s) => (s + 1) % demoImages.length)
        }, 2500)
        return () => clearInterval(timer)
    }, [])

    const sellerSteps = [
        {
            title: 'Launch your storefront',
            description: 'Create a verified seller profile, add location details, and open your curated space.',
            icon: Upload,
            illustrations: ['bg-sky-100/80', 'bg-sky-200/60']
        },
        {
            title: 'Publish standout listings',
            description: 'Upload crisp visuals, set transparent pricing, and tag categories so buyers find you faster.',
            icon: Package,
            illustrations: ['bg-sky-50', 'bg-sky-300/40']
        },
        {
            title: 'Engage and grow trust',
            description: 'Respond quickly, highlight ratings, and keep your catalog fresh to stay on top.',
            icon: Star,
            illustrations: ['bg-orange-50', 'bg-sky-100/50']
        }
    ]

    const buyerSteps = [
        {
            title: 'Discover nearby gems',
            description: 'Filter by category, distance, and budget to surface finds around you.',
            icon: Search,
            illustrations: ['bg-sky-50', 'bg-emerald-100/50']
        },
        {
            title: 'Chat with verified sellers',
            description: 'Use secure messaging or quick calls to clarify details in minutes.',
            icon: PhoneCall,
            illustrations: ['bg-sky-100/80', 'bg-sky-200/40']
        },
        {
            title: 'Pick up with confidence',
            description: 'Arrange meetups, confirm quality on arrival, and rate your experience.',
            icon: Users,
            illustrations: ['bg-sky-50', 'bg-indigo-100/50']
        }
    ]

<<<<<<< HEAD
=======
    // Dynamically inject product image background styles
    useEffect(() => {
        if (featuredProducts.length > 0) {
            featuredProducts.forEach((product) => {
                const styleId = `product-image-style-${product.id}`
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style')
                    style.id = styleId
                    style.innerHTML = `
                        .product-image-${product.id} {
                            background-image: url('${product.images[0]?.url}');
                        }
                    `
                    document.head.appendChild(style)
                }
            })
        }
    }, [featuredProducts])

>>>>>>> a421124 (Initial commit with About page)
    return (
        <motion.div
            className="bg-gradient-to-b from-sky-50 via-white to-sky-100/20 text-gray-800 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
        >
            <motion.div
                className="absolute -right-40 top-1/3 w-96 h-96 rounded-full bg-sky-300/40 blur-3xl pointer-events-none z-0"
                animate={{ y: [0, -50, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <section className="relative overflow-hidden z-10">
                <div className="container-max py-16 md:py-20 grid gap-10 md:grid-cols-2 items-center">
                    <div className="flex justify-center order-2 md:order-1">
                        <div className="relative w-56 sm:w-64 lg:w-72 h-[360px] sm:h-[420px]">
                            {[0, 1, 2].map((offset) => {
                                const index = (slide + offset) % demoImages.length
                                const heights = [220, 150, 110]
                                const topPositions = [0, 130, 230]
                                const opacityLevels = [1, 0.78, 0.6]
                                const borderColors = ['border-sky-100', 'border-white/50', 'border-white/30']
                                return (
                                    <motion.div
                                        key={`${slide}-${offset}`}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: opacityLevels[offset], y: topPositions[offset] }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className={`absolute left-0 w-full rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur border ${borderColors[offset]}`}
                                        style={{ height: heights[offset], zIndex: 30 - offset * 10 }}
                                    >
<<<<<<< HEAD
                                        <img src={demoImages[index]} className="w-full h-full object-cover" />
=======
                                        <img src={demoImages[index]} alt="Product carousel" className="w-full h-full object-cover" />
>>>>>>> a421124 (Initial commit with About page)
                                    </motion.div>
                                )
                            })}
                            <div className="absolute inset-0 rounded-[2.2rem] border border-white/30 pointer-events-none" />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-4 order-1 md:order-2"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Buy and sell locally on <span className="text-sky-600">Connect</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Discover trusted sellers, verified profiles, and great deals near you.
                        </p>

                        <div className="flex gap-2 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sky-500 transition"
                                    placeholder="Search products, categories, locations"
                                />
                            </div>
                            <Link
                                to="/products"
                                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
                            >
                                Search
                            </Link>
                        </div>

                        <div className="flex gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-sky-700">{sellers.toLocaleString()}+</div>
                                <div className="text-gray-600 text-sm">Sellers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600">{buyers.toLocaleString()}+</div>
                                <div className="text-gray-600 text-sm">Buyers</div>
                            </div>
                            <div className="text-center">
<div className="text-3xl font-bold text-green-600">{products.toLocaleString()}</div>
<div className="text-gray-600 text-sm">Products</div>
</div>
</div>
</motion.div>
</div>
</section>

            <section className="bg-white py-20 relative overflow-hidden">
                <div className="absolute inset-x-10 top-16 bottom-8 bg-gradient-to-r from-sky-50 via-white to-sky-100 blur-3xl pointer-events-none" />
                <div className="container-max relative">
                    <motion.h2
                        className="text-3xl font-bold mb-14 text-center text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        How it Works
                    </motion.h2>
                    <div className="relative grid gap-12 md:grid-cols-2">
                        <motion.span
                            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-sky-200 via-sky-400 to-sky-200"
                            initial={{ scaleY: 0.4, opacity: 0 }}
                            whileInView={{ scaleY: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{ transformOrigin: 'top' }}
                        />
                        {[{ label: 'Sellers', accent: 'text-sky-600', steps: sellerSteps }, { label: 'Buyers', accent: 'text-orange-500', steps: buyerSteps }].map(
                            ({ label, accent, steps }) => (
                                <div key={label} className="space-y-8">
                                    <div className="space-y-1">
                                        <p className={`text-xs uppercase tracking-[0.4em] ${accent}`}>{label}</p>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {label === 'Sellers' ? 'Scale your local shop' : 'Shop confidently nearby'}
                                        </h3>
                                    </div>
                                    {steps.map((step, index) => {
                                        const Icon = step.icon
                                        return (
                                            <motion.div
                                                key={step.title}
                                                className="relative pl-10"
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                                            >
                                                <span className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-sky-200 via-sky-400 to-sky-200" />
                                                <div className="flex gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-sky-100 shadow-md flex items-center justify-center text-sky-600">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="absolute -right-4 top-9 w-6 h-6 rounded-xl bg-sky-200/50 blur-sm" />
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="text-xs tracking-[0.3em] text-sky-400">Step {index + 1}</div>
                                                        <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                                                        <p className="text-gray-600">{step.description}</p>
                                                        <div className="relative h-16 rounded-2xl border border-sky-100 bg-gradient-to-r from-white via-sky-50 to-white overflow-hidden">
                                                            <span className={`absolute -left-4 top-2 w-16 h-16 rounded-2xl ${step.illustrations[0]}`} />
                                                            <span className={`absolute right-4 -bottom-3 w-12 h-12 rounded-2xl ${step.illustrations[1]}`} />
                                                            <motion.span
                                                                className="absolute inset-3 rounded-2xl bg-white/60"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

<section className="container-max py-16">
<h2 className="text-2xl font-bold mb-8 text-gray-800">Featured Products</h2>

<div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
    {featuredProducts.map((product) => (
        <motion.div
            key={product.id}
            className="min-w-[260px] bg-white border rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition cursor-pointer"
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => setSelectedProduct(product)}
        >
            <div
<<<<<<< HEAD
                className="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${product.images[0]?.url})` }}
=======
                className={`h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-300 product-image-${product.id}`}
>>>>>>> a421124 (Initial commit with About page)
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

<<<<<<< HEAD
=======
<section className="container-max py-20">
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-8 md:grid-cols-2"
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl"
        >
            <img
                src={photo1}
                alt="Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl"
        >
            <img
                src={photo2}
                alt="Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </motion.div>
    </motion.div>
</section>

<section className="bg-gradient-to-r from-sky-50 to-blue-50 py-20">
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-max space-y-12"
    >
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Featured Clothing & Accessories</h2>
            <p className="text-gray-600 text-lg">Latest trends in style and comfort</p>
        </div>

        <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {clothesSlideImages.map((image, index) => {
                    const labels = ['Premium Shirts', 'Quality Footwear', 'Brand Sneakers', 'Designer Jackets', 'Comfortable Pants']
                    const descriptions = [
                        'High-quality cotton and premium fabric shirts for every occasion',
                        'Comfortable and stylish shoes for casual and formal wear',
                        'Authentic Nike and brand footwear with latest designs',
                        'Trendy jackets perfect for layering and style',
                        'Durable and comfortable pants for everyday wear'
                    ]
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="min-w-[300px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all group overflow-hidden"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={image}
                                    alt={labels[index]}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-0 right-0 bg-sky-600 text-white px-4 py-2 rounded-bl-lg text-sm font-semibold">
                                    Popular
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-sky-600 transition">
                                    {labels[index]}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {descriptions[index]}
                                </p>
                                <button className="w-full mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors">
                                    Shop Now
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    </motion.div>
</section>

>>>>>>> a421124 (Initial commit with About page)
{selectedProduct && (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
    >
        <button
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setSelectedProduct(null)}
<<<<<<< HEAD
=======
            title="Close product details"
            aria-label="Close product details"
>>>>>>> a421124 (Initial commit with About page)
        >
            <X className="h-5 w-5 text-gray-600" />
        </button>
        <img
<<<<<<< HEAD
            src={selectedProduct.images[0]?.url}
            className="rounded-lg mb-4 w-full h-56 object-cover"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.title}</h3>
        <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
        <div className="text-sky-600 font-bold text-lg">${selectedProduct.price}</div>
=======
            src={selectedProduct?.images[0]?.url}
            alt={selectedProduct?.title || 'Product image'}
            className="rounded-lg mb-4 w-full h-56 object-cover"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct?.title}</h3>
        <p className="text-gray-600 mb-2">{selectedProduct?.description}</p>
        <div className="text-sky-600 font-bold text-lg">${selectedProduct?.price}</div>
>>>>>>> a421124 (Initial commit with About page)
    </motion.div>
</div>
)}

        <section className="container-max py-20 relative overflow-hidden">
            <motion.div
                className="absolute -left-10 top-10 w-40 h-40 bg-sky-200/40 blur-3xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -right-10 bottom-12 w-56 h-56 bg-sky-300/30 blur-3xl"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Contact Us</h2>
            <div className="relative max-w-5xl mx-auto">
                <div className="absolute -top-4 right-8 w-16 h-16 rounded-2xl border border-white/40 bg-sky-50/80 backdrop-blur" />
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl px-8 py-10 md:px-12 md:py-12">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-sm uppercase tracking-[0.5em] text-sky-500">We are here</p>
                                <h3 className="text-2xl font-semibold text-gray-900">Let’s talk about your listing</h3>
                            </div>
                            <form className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    />
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us how we can help"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                />
                                <button className="w-full rounded-xl bg-sky-600 text-white font-semibold py-3 hover:bg-sky-700 transition">
                                    Submit
                                </button>
                            </form>
                            <div className="text-sm text-gray-600 text-center md:text-left">
<<<<<<< HEAD
                                {contactInfo && `📞 ${contactInfo.phone} · ✉️ ${contactInfo.email}`}
=======
                                {contactInfo && `📞 ${contactInfo?.phone} · ✉️ ${contactInfo?.email}`}
>>>>>>> a421124 (Initial commit with About page)
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -top-6 left-4 w-12 h-12 rounded-full border border-sky-200 bg-white/80 backdrop-blur flex items-center justify-center text-sky-500">
                                <Upload className="w-5 h-5" />
                            </div>
                            <div className="absolute -bottom-8 right-8 w-16 h-16 rounded-3xl bg-sky-100 blur-xl" />
                            <div className="rounded-[28px] bg-gradient-to-br from-sky-50 via-white to-sky-100 border border-sky-100 shadow-lg p-6">
                                <div className="relative overflow-hidden rounded-2xl">
<<<<<<< HEAD
                                    <img src={images} className="w-full h-64 object-cover rounded-2xl" />
=======
                                    <img src={images} alt="Contact support" className="w-full h-64 object-cover rounded-2xl" />
>>>>>>> a421124 (Initial commit with About page)
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    />
                                </div>
                                <div className="mt-6 grid gap-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <PhoneCall className="w-4 h-4 text-sky-500" />
                                        <span>Instant messaging support</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <User className="w-4 h-4 text-sky-500" />
                                        <span>Dedicated success partner</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>

<footer className="bg-sky-900 text-white pt-14 pb-6 mt-10">
<div className="container-max grid md:grid-cols-3 gap-10 text-center md:text-left">
    <div>
        <h3 className="text-xl font-bold mb-2">Connect</h3>
        <p className="text-sky-200 text-sm">Your trusted platform to buy and sell.</p>
    </div>

    <div>
        <h4 className="font-semibold mb-3 text-lg">Quick Links</h4>
        <ul className="space-y-2 text-sky-200 text-sm">
            <li>
                <Link to="/" className="hover:text-white transition">
                    Home
                </Link>
            </li>
            <li>
                <Link to="/products" className="hover:text-white transition">
                    Products
                </Link>
            </li>
            <li>
                <Link to="/contact" className="hover:text-white transition">
                    Contact
                </Link>
            </li>
        </ul>
    </div>

    <div>
        <h4 className="font-semibold mb-3 text-lg">Follow Us</h4>
        <div className="flex justify-center md:justify-start gap-4">
            <a className="hover:text-sky-300 transition">
                <Facebook />
            </a>
            <a className="hover:text-sky-300 transition">
                <Instagram />
            </a>
            <a className="hover:text-sky-300 transition">
                <Twitter />
            </a>
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
