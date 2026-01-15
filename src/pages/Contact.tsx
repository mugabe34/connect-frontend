import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, PhoneCall, MapPin } from 'lucide-react'
import { useToast } from '../components/Toast'
import get_in_touch from '../assets/get_in_touch.png'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { show } = useToast()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return show('Please fill all fields', 'error')
    show('Message sent (stub)', 'success')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <motion.div
      className="relative bg-gradient-to-b from-sky-50 via-white to-sky-100/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />
      <div className="relative container-max min-h-[70vh] py-12 flex items-center">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-2xl px-6 py-8 sm:px-8 sm:py-10"
          >
            <div className="mb-6 space-y-2 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Contact</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">We would love to hear from you</h1>
              <p className="text-sm text-gray-600">
                Share your questions, feedback, or ideas and our team will get back to you shortly.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[140px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Tell us how we can help"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Send message
              </button>
            </form>
            <div className="mt-6 grid gap-3 text-xs text-gray-600 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-500" />
                <span>support@connect.local</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-sky-500" />
                <span>+250 781 908 314</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative"
          >
            <div className="absolute -top-6 left-4 h-10 w-10 rounded-full border border-sky-200 bg-white/80 shadow-md" />
            <div className="absolute -bottom-10 right-0 h-20 w-20 rounded-3xl bg-sky-200/50 blur-xl" />
            <div className="relative rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-100 p-5 shadow-xl">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={get_in_touch} className="h-64 w-full object-cover" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-sky-900/45 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-5 space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-600">
                    1
                  </span>
                  <span>Share your request in a few lines.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-600">
                    2
                  </span>
                  <span>We connect you with the right team member.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-600">
                    3
                  </span>
                  <span>Move your buying or selling journey forward.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}