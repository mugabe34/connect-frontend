import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { useAuth } from '../providers/AuthProvider'
import { motion } from 'framer-motion'
import { Lock, Mail, ShieldCheck } from 'lucide-react'

export function AuthAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { show } = useToast()
  const navigate = useNavigate()
  const { login } = useAuth()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      show('Admin authenticated', 'success')
      navigate('/admin')
    } catch (err: any) {
      show(err.message || 'Invalid admin credentials', 'error')
    }
  }

  return (
    <div className="bg-slate-900/95 min-h-screen py-16">
      <div className="container-max flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl px-8 py-9 shadow-[0_20px_60px_rgba(15,23,42,0.9)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Restricted area</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">Admin Console Access</h1>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Use your assigned administrator credentials to access moderation and platform controls.
          </p>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-700 rounded-xl bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 outline-none"
                placeholder="admin@connect.local"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-200 flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-700 rounded-xl bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Only authorised staff may log in.</span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-900 text-sm font-semibold hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 transition"
            >
              Enter admin console
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}