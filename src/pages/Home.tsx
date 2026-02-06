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
import stepOne from '../assets/1.png'
import stepTwo from '../assets/2.png'

/* ================= HELPERS ================= */

const demoImages = [pants, jackets, shoes, images]

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
    const [slide, setSlide] = useState(0)

    const buyers = useAnimatedCounter(1500000)
    const sellers = useAnimatedCounter(1000)
    const products = useAnimatedCounter(2756)

    useEffect(() => {
        api<Product[]>('/api/products?featured=true&limit=8').then(setFeaturedProducts)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((s) => (s + 1) % demoImages.length)
        }, 2500)
        return () => clearInterval(timer)
    }, [])

    /* ================= HOW IT WORKS DATA ================= */

    const sellerSteps = [
        {
            title: 'Launch your storefront',
            description: 'Create a verified seller profile and open your digital shop.',
            icon: Upload
        },
        {
            title: 'Publish standout listings',
            description: 'Upload quality photos and transparent pricing.',
            icon: Package
        },
        {
            title: 'Build trust & grow',
            description: 'Engage buyers and earn ratings.',
            icon: Star
        }
    ]

    const buyerSteps = [
        {
            title: 'Discover nearby products',
            description: 'Browse items from sellers around you.',
            icon: Search
        },
        {
            title: 'Chat with sellers',
            description: 'Ask questions before buying.',
            icon: Users
        },
        {
            title: 'Buy with confidence',
            description: 'Meet safely and rate your experience.',
            icon: ShieldCheck
        }
    ]

    return (
        <motion.div
            className="bg-gradient-to-b from-sky-50 via-white to-sky-100/20 text-gray-800 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {/* ================= HERO ================= */}
            <section className="container-max py-20 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Buy & Sell Locally on <span className="text-sky-600">Connect</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        A trusted marketplace connecting verified sellers with real buyers nearby.
                    </p>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sky-500"
                                placeholder="Search products or locations"
                            />
                        </div>
                        <Link
                            to="/products"
                            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
                        >
                            Search
                        </Link>
                    </div>

                    <div className="flex gap-10 pt-6">
                        <Stat label="Sellers" value={sellers} color="text-sky-700" />
                        <Stat label="Buyers" value={buyers} color="text-orange-600" />
                        <Stat label="Products" value={products} color="text-green-600" />
                    </div>
                </div>

                <div className="relative h-[420px] flex justify-center">
                    {[0, 1, 2].map((o) => {
                        const index = (slide + o) % demoImages.length
                        return (
                            <motion.img
                                key={o}
                                src={demoImages[index]}
                                className="absolute w-64 h-64 rounded-2xl object-cover shadow-2xl"
                                style={{ top: o * 70, zIndex: 20 - o }}
                                whileHover={{ scale: 1.05 }}
                            />
                        )
                    })}
                </div>
            </section>

            {/* ================= BUILT FOR BUYERS & SELLERS ================= */}
            <section className="py-20 bg-white">
                <div className="container-max grid md:grid-cols-2 gap-12 items-center">
                    <motion.img
                        src={stepOne}
                        alt="Connect workflow"
                        className="rounded-3xl shadow-xl"
                        whileHover={{ scale: 1.04 }}
                    />
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Built for Buyers & Sellers</h2>
                        <p className="text-gray-600">
                            Connect removes friction by enabling direct, transparent interactions.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-3"><Upload className="text-sky-600" /> Easy listings</li>
                            <li className="flex gap-3"><Users className="text-orange-500" /> Direct communication</li>
                            <li className="flex gap-3"><Star className="text-green-600" /> Trust through ratings</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= TRUST & SAFETY ================= */}
            <section className="py-20 bg-sky-50">
                <div className="container-max grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Trust & Safety</h2>
                        <p className="text-gray-600">
                            Security and transparency are built into every interaction.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <TrustCard icon={UserCheck} title="Verified Sellers" />
                            <TrustCard icon={ShieldCheck} title="Community Ratings" />
                            <TrustCard icon={Lock} title="Secure Messaging" />
                            <TrustCard icon={Package} title="Clear Listings" />
                        </div>
                    </div>

                    <motion.img
                        src={stepTwo}
                        alt="Trust system"
                        className="rounded-3xl shadow-xl"
                        whileHover={{ scale: 1.04 }}
                    />
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="py-20 bg-white">
                <div className="container-max grid md:grid-cols-2 gap-16">
                    <StepColumn title="For Sellers" steps={sellerSteps} />
                    <StepColumn title="For Buyers" steps={buyerSteps} />
                </div>
            </section>

            {/* ================= FEATURED PRODUCTS ================= */}
            <section className="container-max py-16">
                <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {featuredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className="min-w-[260px] bg-white border rounded-xl shadow-lg cursor-pointer"
                            whileHover={{ y: -6 }}
                            onClick={() => setSelectedProduct(product)}
                            style={{ backgroundImage: `url('${product.images[0]?.url}')` } as React.CSSProperties}
                        >
                            {/* Product image background */}
                            <div
                                className="h-44 bg-cover bg-center rounded-t-xl"
                            />
                            <div className="p-5">
                                <h3 className="font-semibold">{product.title}</h3>
                                <p className="text-sky-600 font-bold">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= PRODUCT MODAL ================= */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-md w-full relative"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <button className="absolute top-3 right-3" onClick={() => setSelectedProduct(null)} title="Close modal" aria-label="Close product details modal">
                            <X />
                        </button>
                        <img
                            src={selectedProduct.images[0]?.url}
                            alt={selectedProduct.title}
                            className="h-56 w-full object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                        <p className="text-gray-600">{selectedProduct.description}</p>
                        <div className="text-sky-600 font-bold text-lg">${selectedProduct.price}</div>
                    </motion.div>
                </div>
            )}

            {/* ================= FOOTER ================= */}
            <footer className="bg-sky-900 text-white py-12">
                <div className="container-max grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-xl">Connect</h3>
                        <p className="text-sky-200 text-sm">Trusted local marketplace</p>
                    </div>
                    <div>
                        <Link to="/" className="block hover:text-sky-300">Home</Link>
                        <Link to="/products" className="block hover:text-sky-300">Products</Link>
                    </div>
                    <div className="flex gap-4">
                        <Facebook />
                        <Instagram />
                        <Twitter />
                    </div>
                </div>
            </footer>
        </motion.div>
    )
}

/* ================= SMALL COMPONENTS ================= */

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="text-center">
            <div className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}+</div>
            <div className="text-gray-600 text-sm">{label}</div>
        </div>
    )
}

function TrustCard({ icon: Icon, title }: { icon: any; title: string }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow flex gap-3 items-center hover:shadow-xl transition">
            <Icon className="text-sky-600" />
            <span className="font-medium">{title}</span>
        </div>
    )
}

function StepColumn({ title, steps }: { title: string; steps: any[] }) {
    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-semibold">{title}</h3>
            {steps.map((step, i) => (
                <motion.div
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <step.icon className="text-sky-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
