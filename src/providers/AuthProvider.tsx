import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin'
export type GoogleAuthResult = {
  user: User
  isNewUser: boolean
}

type AuthContextValue = {
  user: User | null
  role: UserRole
  setUser: (user: User | null) => void
  setRole: (role: UserRole) => void
  login: (email: string, password: string) => Promise<User>
  loginWithGoogle: () => void
  loginWithGoogleSSO: (location: string | null, role: 'buyer' | 'seller') => Promise<void>
  exchangeGoogleCredential: (
    credential: string,
    role: 'buyer' | 'seller',
    location?: string | null
  ) => Promise<GoogleAuthResult>
  logout: () => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    role: 'buyer' | 'seller',
    extra?: { phone?: string; location?: string }
  ) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<UserRole>('guest')

  useEffect(() => {
    if (user) {
      setRole(user.role as UserRole)
    } else {
      setRole('guest')
    }
  }, [user])

  async function checkUser() {
    try {
      const { user } = await api<{ user: User | null }>('/api/auth/session')
      setUser(user)
    } catch {
      setUser(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    const { user } = await api<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(user)
    return user
  }

  const exchangeGoogleCredential = async (
    credential: string,
    userRole: 'buyer' | 'seller',
    location?: string | null
  ) => {
    const result = await api<GoogleAuthResult>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        idToken: credential,
        role: userRole,
        location: location ?? null,
      }),
    })
    setUser(result.user)
    return result
  }

  const loginWithGoogle = () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    window.location.href = `${API_BASE}/api/auth/google`
  }

  const loginWithGoogleSSO = async (location: string | null, userRole: 'buyer' | 'seller') => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) throw new Error('Google client id not configured')

    // Load Google Identity Services once
    await new Promise<void>((resolve, reject) => {
      // @ts-ignore
      if (window.google?.accounts?.id) return resolve()
      const existing = document.querySelector('script[data-google-gsi="1"]')
      if (existing) {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error('Failed to load Google sign-in')))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleGsi = '1'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google sign-in'))
      document.head.appendChild(script)
    })

    return new Promise<void>((resolve, reject) => {
      let done = false
      const finish = (fn: () => void) => {
        if (done) return
        done = true
        fn()
      }

      // @ts-ignore
      const google = window.google
      if (!google?.accounts?.id) {
        return finish(() => reject(new Error('Google sign-in failed to initialize')))
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            if (!response.credential) {
              return finish(() => reject(new Error('Google sign-in failed')))
            }

            const result = await api<{ user: User }>('/api/auth/google', {
              method: 'POST',
              body: JSON.stringify({
                idToken: response.credential,
                role: userRole,
                location: location,
              }),
            })

            setUser(result.user)
            finish(() => resolve())
          } catch (err: any) {
            finish(() => reject(err))
          }
        },
      })

      // Trigger the prompt on demand (user click)
      if (typeof google.accounts.id.prompt !== 'function') {
        finish(() => reject(new Error('Google sign-in failed to initialize')))
        return
      }

      google.accounts.id.prompt((notification: any) => {
        if (!notification) return
        if (notification.isNotDisplayed?.()) {
          finish(() =>
            reject(
              new Error(
                'Google sign-in was blocked or not displayed. Please allow popups/third-party cookies and try again.'
              )
            )
          )
          return
        }
        if (notification.isSkippedMoment?.()) {
          finish(() => reject(new Error('Google sign-in cancelled')))
        }
      })
    })
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'buyer' | 'seller',
    extra?: { phone?: string; location?: string }
  ) => {
    const { user } = await api<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        phone: extra?.phone,
        location: extra?.location,
      }),
    })
    setUser(user)
  }

  const value = useMemo(
    () => ({
      user,
      role,
      setUser,
      setRole,
      login,
      loginWithGoogle,
      loginWithGoogleSSO,
      exchangeGoogleCredential,
      logout,
      register,
      isLoading,
    }),
    [user, role, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
