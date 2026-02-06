import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, ArrowRight, LockKeyhole } from 'lucide-react';

export function Auth() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-slate-100 min-h-screen py-16">
      <div className="container-max">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-sky-500">
              Sign in to Connect
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Are you buying or selling today?
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
              Choose how you want to use the marketplace so we can take you to the right experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.button
              type="button"
              onClick={() => navigate('/auth/buyer')}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm hover:shadow-xl hover:border-sky-300 transition flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">I&apos;m a buyer</h2>
                  <p className="text-xs text-slate-500">
                    Discover products from verified local sellers and connect via WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>No listing tools, just browsing and contacting sellers.</span>
                <span className="inline-flex items-center gap-1 text-sky-600 font-semibold">
                  Continue
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/auth/seller')}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm hover:shadow-xl hover:border-sky-300 transition flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-sky-100 flex items-center justify-center">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">I&apos;m a seller</h2>
                  <p className="text-xs text-slate-500">
                    Create a seller account, upload products, and manage your catalogue from a dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Requires phone number for WhatsApp contact and product uploads.</span>
                <span className="inline-flex items-center gap-1 text-sky-600 font-semibold">
                  Continue
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/auth/admin')}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 px-6 py-7 shadow-sm hover:shadow-xl hover:border-emerald-500 transition flex flex-col justify-between gap-4 md:col-span-2"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Admin Console</h2>
                  <p className="text-xs text-slate-600">
                    Restricted access: Manage users, products, and platform settings.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Administrator credentials required for access.</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  Enter Console
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

