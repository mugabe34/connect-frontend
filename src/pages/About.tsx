import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../components/Toast'
import { Users, Zap, Shield, TrendingUp, ShoppingBag, Store, LogIn } from 'lucide-react'
import conlogo from '../assets/conlogo-256.png'

/* =======================
   ANIMATION VARIANTS
======================= */
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.2 }
  }
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

/* =======================
   DATA
======================= */
const coreValues = [
  {
    icon: Shield,
    title: 'Trust',
    description:
      'Verified profiles and secure transactions that protect both buyers and sellers.'
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Building strong connections between sellers and customers in local markets.'
  },
  {
    icon: Zap,
    title: 'Simplicity',
    description:
      'An intuitive platform designed for anyone to use, regardless of technical skill.'
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description:
      'Empowering sellers with tools to expand their reach and grow their business.'
  }
]

const developers = [
  {
    name: 'Mugabe',
    role: 'Full-Stack Developer',
    focus: 'Architecture & Backend Infrastructure'
  },
  {
    name: 'Maurice',
    role: 'Full-Stack Developer',
    focus: 'Frontend & User Experience Design'
  }
]

/* =======================
   COMPONENT
======================= */
export default function About() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const { show } = useToast()

  const browseProducts = () => {
    if (role === 'guest') {
      show('Please sign in as a buyer to browse products.', 'info')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-white text-gray-800"
    >
      {/* HERO */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                About <span className="text-sky-600">Connect</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Reimagining local commerce by empowering sellers to connect
                directly with customers and grow sustainably.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="flex flex-col items-center">
              <img
                src={conlogo}
                alt="Connect Logo"
                loading="lazy"
                decoding="async"
                className="w-48 md:w-80 object-contain"
              />
              <p className="mt-8 text-center text-gray-600 max-w-xs">
                Bridging the gap between local sellers and customers through
                trust, simplicity, and innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeInUp}>
            <p className="uppercase tracking-[0.3em] text-sky-600 font-semibold mb-3">
              Our Mission
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transforming Local Business
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Connect enables direct communication, builds trust, and removes
              barriers between buyers and sellers.
            </p>
            <p className="text-lg text-gray-600">
              Designed for small businesses, artisans, and resellers to thrive
              digitally.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="rounded-3xl bg-white shadow-xl p-10 border border-gray-200"
          >
            <Stat value="500+" label="Active Sellers" />
            <Stat value="50K+" label="Monthly Users" />
            <Stat value="100%" label="Secure Transactions" />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Core Values
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {coreValues.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  className="
                    p-8 rounded-2xl
                    bg-white
                    border border-gray-200
                    hover:shadow-xl hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <Icon className="w-7 h-7 text-sky-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* DEVELOPERS */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Developed By
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {developers.map((dev) => (
              <motion.div
                key={dev.name}
                {...fadeInUp}
                className="
                  p-8 rounded-2xl
                  bg-white
                  border border-gray-200
                  hover:shadow-xl transition-all
                "
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  {dev.name}
                </h3>
                <p className="text-sky-600 font-semibold">{dev.role}</p>
                <p className="mt-3 text-gray-600">
                  {dev.focus}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Join Connect?
            </h2>

            {/* Mobile: keep CTAs in the navbar, show sign-in guidance here */}
            <div className="sm:hidden max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-5 text-left">
              <p className="text-sm font-semibold text-gray-900">Sign in first</p>
              <p className="text-sm text-gray-600 mt-1">
                Use the menu to continue, or choose an option below.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/auth/buyer')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold inline-flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" /> Sign in as Buyer
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth/seller')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Store className="h-4 w-4" /> Sign in as Seller
                </button>
              </div>
            </div>

            {/* Desktop/tablet: CTAs inline */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={browseProducts}
                className="px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </button>
              <button
                type="button"
                onClick={startSelling}
                className="px-8 py-4 rounded-xl border-2 border-sky-600 text-sky-600 font-semibold text-lg hover:bg-sky-50 inline-flex items-center justify-center gap-2"
              >
                <Store className="h-5 w-5" />
                Start Selling
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

/* =======================
   SMALL COMPONENT
======================= */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mb-6">
      <div className="text-4xl font-bold text-sky-600">{value}</div>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}
