import { useEffect, useState } from 'react'
import { Loader } from './Loader'

export function GlobalLoaderGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(t)
  }, [])
  if (!ready) return <Loader />
  return <>{children}</>
}


