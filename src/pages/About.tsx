import { motion } from 'framer-motion'
import { Users, Zap, Shield, TrendingUp } from 'lucide-react'

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="
        bg-gradient-to-b
        from-sky-50 via-white to-sky-100/20
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        text-gray-800 dark:text-gray-200
        transition-colors duration-500
      "
    >
      {/* HERO */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                About <span className="text-sky-600">Connect</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                Reimagining local commerce by empowering sellers to connect
                directly with customers and grow sustainably.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="flex flex-col items-center justify-center">
              <img
                src={new URL('../assets/conlogo.png', import.meta.url).href}
                alt="Connect Logo"
                className="w-48 h-auto md:w-80 lg:w-90 object-contain filter brightness-0 invert dark:brightness-100 dark:invert-0"
              />
              <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xs">
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Transforming Local Business
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Connect enables direct communication, builds trust, and removes
              barriers between buyers and sellers.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Designed for small businesses, artisans, and resellers to thrive
              digitally.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="
              rounded-3xl bg-white dark:bg-slate-900
              shadow-xl p-10 border border-sky-100 dark:border-slate-800
            "
          >
            <Stat value="500+" label="Active Sellers" />
            <Stat value="50K+" label="Monthly Users" />
            <Stat value="100%" label="Secure Transactions" />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
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
                    bg-gradient-to-br from-sky-50 to-white
                    dark:from-slate-900 dark:to-slate-950
                    border border-sky-100 dark:border-slate-800
                    hover:shadow-xl hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <Icon className="w-7 h-7 text-sky-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
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
                  bg-white dark:bg-slate-900
                  border border-sky-100 dark:border-slate-800
                  hover:shadow-xl transition-all
                "
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dev.name}
                </h3>
                <p className="text-sky-600 font-semibold">{dev.role}</p>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
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
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Join Connect?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="
                  px-8 py-4 rounded-xl
                  bg-sky-600 hover:bg-sky-700
                  text-white font-semibold text-lg
                  transition-all
                "
              >
                Browse Products
              </a>
              <a
                href="/auth"
                className="
                  px-8 py-4 rounded-xl
                  border-2 border-sky-600
                  text-sky-600 font-semibold text-lg
                  hover:bg-sky-50 dark:hover:bg-slate-800
                  transition-all
                "
              >
                Start Selling
              </a>
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
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  )
}
