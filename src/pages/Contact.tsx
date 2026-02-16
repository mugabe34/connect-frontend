import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  PhoneCall,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Users,
  HelpCircle
} from 'lucide-react'
import { useToast } from '../components/Toast'
import get_in_touch from '../assets/get-in-touch.jpg'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { show } = useToast()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) {
      return show('Please fill all fields', 'error')
    }
    show('Message sent (stub)', 'success')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* =======================
          PAGE HEADER
      ======================= */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
            Contact
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Ask how we can help you
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Whether you’re buying, selling, or need support, our team is ready
            to guide you.
          </p>
        </div>
      </section>

      {/* =======================
          HELP OPTIONS (NO RADIUS)
      ======================= */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <HelpBlock
              icon={ShoppingBag}
              title="Buying Products"
              text="Questions about products, pricing, or placing orders."
            />
            <HelpBlock
              icon={Users}
              title="Selling on Connect"
              text="Get help setting up, managing, or growing your store."
            />
            <HelpBlock
              icon={ShieldCheck}
              title="Trust & Safety"
              text="Learn how we protect buyers and sellers on the platform."
            />
            <HelpBlock
              icon={HelpCircle}
              title="General Support"
              text="Any other questions? We’re happy to help."
            />
          </div>
        </div>
      </section>

      {/* =======================
          CONTACT FORM SECTION
      ======================= */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-6xl grid gap-12 lg:grid-cols-2 items-start">

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="border border-gray-200 bg-white shadow-lg px-6 py-8 sm:px-10 sm:py-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contact our team
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in the form and we’ll get back to you as soon as possible.
            </p>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[160px] border border-gray-300 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm text-gray-600">
              <Info icon={Mail} text="mugabeherve7@gmail.com" /><br/>
              <Info icon={Mail} text="hirwajules2000@gmail.com" />
              <Info icon={PhoneCall} text="+250 781 908 314" />
              <Info icon={MapPin} text="Kigali, Rwanda" />
            </div>
          </motion.div>

          {/* IMAGE / PROCESS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="hidden lg:block"
          >
            <img
              src={get_in_touch}
              alt="Get in touch"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover border border-gray-200"
            />
          </motion.div>

        </div>
      </section>
    </motion.div>
  )
}

/* =======================
   SMALL COMPONENTS
======================= */

function HelpBlock({
  icon: Icon,
  title,
  text
}: {
  icon: any
  title: string
  text: string
}) {
  return (
    <div className="border border-gray-200 p-6 bg-gray-50">
      <Icon className="h-6 w-6 text-sky-600 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  )
}

function Info({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-sky-500" />
      <span>{text}</span>
    </div>
  )
}
