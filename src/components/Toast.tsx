import { createContext, useContext, useState } from 'react'

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
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }
  return (
    <ToastCtx.Provider value={{ toasts, show }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-500' : t.type === 'success' ? 'bg-green-600' : 'bg-slate-700'}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}


