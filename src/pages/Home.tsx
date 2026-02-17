import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, getImageUrl } from '../lib/api'
import type { Product } from '../types'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../components/Toast'
import {
    Users,
    Package,
    Star,
    Search,
    X,
    Upload,
    ShieldCheck,
    Lock,
    UserCheck,
    Facebook,
    Instagram,
    Twitter
} from 'lucide-react'

import jackets from '../assets/jackets.jpg'
import pants from '../assets/pants.jpg'
import shoes from '../assets/shoes.jpg'
import images from '../assets/images.jpg'
import stepOne from '../assets/step-1.jpg'
import stepTwo from '../assets/step-2.jpg'
import cotton_jacket from '../assets/cotton_jacket.jpg'
import barca from '../assets/barca-tshirt.jpg'

/* ================= HELPERS ================= */

const demoImages = [pants, jackets, shoes, images, cotton_jacket, barca]

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

/* ================= HOME ================= */

export function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    
    const navigate = useNavigate()
    const { role } = useAuth()
    const { show } = useToast()

    const buyers = useAnimatedCounter(1500000)
    const sellers = useAnimatedCounter(1000)
    const products = useAnimatedCounter(2756)

    // Circular Auto-play logic
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % demoImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const browseProducts = () => {
        if (role === 'guest') {
            show('Sign in or register as a buyer to browse products.', 'info')
            navigate('/auth/buyer')
            return
        }
        navigate('/products')
    }

    const startSelling = () => {
        if (role === 'seller' || role === 'admin') {
            navigate('/dashboard')
            return
        }
        show('Please sign in as a seller to start selling.', 'info')
        navigate('/auth/seller')
    }

    useEffect(() => {
        api<Product[]>('/api/products?featured=true&limit=8').then(setFeaturedProducts)
    }, [])

    /* ================= DATA ================= */

    const sellerSteps = [
        { title: 'Launch storefront', description: 'Create a verified seller profile.', icon: Upload },
        { title: 'Publish listings', description: 'Upload photos and pricing.', icon: Package },
        { title: 'Build trust', description: 'Engage and earn ratings.', icon: Star }
    ]

    const buyerSteps = [
        { title: 'Discover items', description: 'Browse items around you.', icon: Search },
        { title: 'Chat direct', description: 'Ask questions before buying.', icon: Users },
        { title: 'Buy safely', description: 'Meet safely and rate.', icon: ShieldCheck }
    ]

    return (
        <motion.div
            className="bg-gradient-to-b from-sky-50 via-white to-sky-100/20 text-gray-800 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* ================= HERO SECTION ================= */}
            <section className="container-max py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center px-4">
                <div className="space-y-8 z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        Buy & Sell Locally on <span className="text-sky-600">Connect</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-md">
                        The trusted community marketplace for verified sellers and real buyers.
                    </p>

                    {/* Navigation Buttons: Fixed for Mobile Visibility */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={browseProducts}
                            className="flex w-full sm:w-auto px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all shadow-lg shadow-sky-100 items-center justify-center gap-2"
                        >
                            <Search className="h-5 w-5" />
                            Browse Products
                        </button>
                        <button
                            type="button"
                            onClick={startSelling}
                            className="flex w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold transition-all items-center justify-center gap-2"
                        >
                            <Upload className="h-5 w-5" />
                            Start Selling
                        </button>
                    </div>

                    <div className="flex gap-10 pt-4">
                        <Stat label="Sellers" value={sellers} color="text-sky-700" />
                        <Stat label="Buyers" value={buyers} color="text-orange-600" />
                        <Stat label="Items" value={products} color="text-green-600" />
                    </div>
                </div>

                {/* Circular "Packed" Slideshow */}
                <div className="relative h-[400px] flex items-center justify-center perspective-1000">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="popLayout">
                            {demoImages.map((src, idx) => {
                                // Calculate circular offset
                                let offset = idx - activeIndex;
                                if (offset > demoImages.length / 2) offset -= demoImages.length;
                                if (offset < -demoImages.length / 2) offset += demoImages.length;

                                const isCenter = offset === 0;
                                const absOffset = Math.abs(offset);

                                return (
                                    <motion.div
                                        key={src}
                                        initial={false}
                                        animate={{
                                            x: offset * 110, // Packed horizontal spread
                                            scale: isCenter ? 1.1 : 0.8 - absOffset * 0.1,
                                            zIndex: 20 - absOffset,
                                            opacity: isCenter ? 1 : 0.6 / (absOffset + 0.5),
                                            rotateY: offset * 10,
                                        }}
                                        transition={{ 
                                            type: 'spring', 
                                            stiffness: 120, 
                                            damping: 18 
                                        }}
                                        className="absolute"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <img
                                            src={src}
                                            alt="Marketplace"
                                            className={`
                                                w-52 h-72 sm:w-64 sm:h-80 object-cover rounded-[2.5rem] shadow-2xl 
                                                border-none transition-all duration-700
                                                ${isCenter ? 'brightness-100' : 'brightness-90'}
                                            `}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-20 bg-white px-4">
                <div className="container-max grid md:grid-cols-2 gap-12 items-center">
                    <motion.img
                        src={stepOne}
                        alt="Workflow"
                        className="rounded-3xl shadow-xl"
                        whileHover={{ scale: 1.02 }}
                    />
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Built for Buyers & Sellers</h2>
                        <p className="text-gray-600">Direct, transparent, and hassle-free local commerce.</p>
                        <ul className="space-y-4">
                            <li className="flex gap-3 font-medium"><Upload className="text-sky-600" /> Instant listings</li>
                            <li className="flex gap-3 font-medium"><Users className="text-orange-500" /> Direct chat</li>
                            <li className="flex gap-3 font-medium"><Star className="text-green-600" /> User feedback</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= TRUST ================= */}
            <section className="py-20 bg-sky-50 px-4">
                <div className="container-max grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Trust & Safety</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <TrustCard icon={UserCheck} title="Verified Profiles" />
                            <TrustCard icon={ShieldCheck} title="Community Moderation" />
                            <TrustCard icon={Lock} title="Private Chat" />
                            <TrustCard icon={Package} title="Quality Assurance" />
                        </div>
                    </div>
                    <motion.img
                        src={stepTwo}
                        alt="Safety"
                        className="rounded-3xl shadow-xl"
                        whileHover={{ scale: 1.02 }}
                    />
                </div>
            </section>

            {/* ================= STEPS ================= */}
            <section className="py-20 bg-white px-4">
                <div className="container-max grid md:grid-cols-2 gap-16">
                    <StepColumn title="For Sellers" steps={sellerSteps} />
                    <StepColumn title="For Buyers" steps={buyerSteps} />
                </div>
            </section>

            {/* ================= FEATURED PRODUCTS ================= */}
            <section className="container-max py-16 px-4">
                <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                    {featuredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className="min-w-[260px] bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div
                                className="h-48 bg-cover bg-center"
                                style={{ backgroundImage: `url('${getImageUrl(product.images[0]?.url)}')` }}
                            />
                            <div className="p-6">
                                <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                                <p className="text-sky-600 font-black text-lg">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= MODAL ================= */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-[2rem] p-8 max-w-md w-full relative shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <button className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full hover:bg-gray-100" onClick={() => setSelectedProduct(null)}>
                            <X size={20}/>
                        </button>
                        <img
                            src={getImageUrl(selectedProduct.images[0]?.url)}
                            alt={selectedProduct.title}
                            className="h-64 w-full object-cover rounded-2xl mb-6"
                        />
                        <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h3>
                        <p className="text-gray-600 my-3 leading-relaxed">{selectedProduct.description}</p>
                        <div className="text-sky-600 font-black text-2xl">${selectedProduct.price}</div>
                    </motion.div>
                </div>
            )}

            {/* ================= FOOTER ================= */}
            <footer className="bg-sky-900 text-white py-16 px-4">
                <div className="container-max grid md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="font-bold text-2xl mb-2">Connect</h3>
                        <p className="text-sky-200/70">Local trading, redefined.</p>
                    </div>
                    <div className="space-y-3">
                        <Link to="/" className="block hover:text-sky-300">Home</Link>
                        <button
                            type="button"
                            onClick={browseProducts}
                            className="block text-left hover:text-sky-300"
                        >
                            Browse Products
                        </button>
                    </div>
                    <div className="flex gap-6">
                        <Facebook className="hover:text-sky-300 cursor-pointer" />
                        <Instagram className="hover:text-sky-300 cursor-pointer" />
                        <Twitter className="hover:text-sky-300 cursor-pointer" />
                    </div>
                </div>
            </footer>
        </motion.div>
    )
}

/* ================= SMALL COMPONENTS ================= */

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="text-left">
            <div className={`text-3xl font-black ${color}`}>{value.toLocaleString()}+</div>
            <div className="text-gray-500 text-sm font-medium">{label}</div>
        </div>
    )
}

function TrustCard({ icon: Icon, title }: { icon: any; title: string }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center hover:shadow-md transition">
            <div className="p-2 bg-sky-50 rounded-xl">
                <Icon className="text-sky-600" size={20} />
            </div>
            <span className="font-bold text-gray-800">{title}</span>
        </div>
    )
}

function StepColumn({ title, steps }: { title: string; steps: any[] }) {
    return (
        <div className="space-y-10">
            <h3 className="text-2xl font-bold border-l-4 border-sky-600 pl-4">{title}</h3>
            {steps.map((step, i) => (
                <motion.div
                    key={i}
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-100">
                        <step.icon size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900">{step.title}</h4>
                        <p className="text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
