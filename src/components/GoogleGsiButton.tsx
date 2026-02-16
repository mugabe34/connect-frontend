import { useEffect, useMemo, useRef, useState } from 'react'

type GsiCredentialResponse = { credential?: string }

type GoogleId = {
  initialize: (opts: { client_id: string; callback: (response: GsiCredentialResponse) => void }) => void
  prompt?: (momentListener: (notification: unknown) => void) => void
  renderButton: (
    parent: HTMLElement,
    options: { theme?: string; size?: string; shape?: string; width?: number }
  ) => void
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleId } }
  }
}

type Props = {
  onCredential: (credential: string) => void | Promise<void>
  disabled?: boolean
}

export function GoogleGsiButton({ onCredential, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const clientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined, [])

  useEffect(() => {
    if (!clientId) {
      setLoadError('Google client id not configured')
      return
    }

    let cancelled = false
    const cid = clientId

    async function ensureLoaded() {
      if (window.google?.accounts?.id) return
      const existing = document.querySelector('script[data-google-gsi="1"]') as HTMLScriptElement | null
      if (existing) {
        await new Promise<void>((resolve, reject) => {
          existing.addEventListener('load', () => resolve())
          existing.addEventListener('error', () => reject(new Error('Failed to load Google sign-in')))
        })
        return
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.dataset.googleGsi = '1'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Google sign-in'))
        document.head.appendChild(script)
      })
    }

    async function setup() {
      try {
        await ensureLoaded()
        if (cancelled) return
        const google = window.google
        if (!google?.accounts?.id) throw new Error('Google sign-in failed to initialize')
        if (!containerRef.current) return

        containerRef.current.innerHTML = ''
        google.accounts.id.initialize({
          client_id: cid,
          callback: async (response) => {
            if (!response?.credential) return
            await onCredential(response.credential)
          },
        })

        const width = Math.min(420, containerRef.current.clientWidth || 320)
        google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width,
        })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load Google sign-in'
        setLoadError(message)
      }
    }

    setup()

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential])

  if (loadError) {
    return (
      <button
        type="button"
        disabled
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-semibold"
        title={loadError}
      >
        Google sign-in unavailable
      </button>
    )
  }

  return (
    <div
      aria-disabled={disabled ? 'true' : 'false'}
      className={disabled ? 'pointer-events-none opacity-60' : undefined}
    >
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  )
}
