import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' }

const ToastCtx = createContext<{
  toasts: Toast[]
  show: (message: string, type?: Toast['type']) => void
}>({ toasts: [], show: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function show(message: string, type: Toast['type'] = 'info') {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => removeToast(id), 3500)
  }

  function removeToast(id: number) {
    setToasts((t) => t.filter((x) => x.id !== id))
  }

  const getIcon = (type?: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-white" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-white" />
      default:
        return <Info className="h-5 w-5 text-white" />
    }
  }

  const getStyles = (type?: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
      case 'error':
        return 'bg-red-500 shadow-lg shadow-red-500/20'
      default:
        return 'bg-slate-700 shadow-lg shadow-slate-700/20'
    }
  }

  return (
    <ToastCtx.Provider value={{ toasts, show }}>
      {children}
      <div className="fixed top-4 right-4 space-y-3 z-50 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl text-white font-semibold text-sm pointer-events-auto ${getStyles(t.type)} backdrop-blur-sm`}
            >
              {getIcon(t.type)}
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2"
                title="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}


