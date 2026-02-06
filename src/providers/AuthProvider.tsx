import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin'

type AuthContextValue = {
  user: User | null
  role: UserRole
  setRole: (role: UserRole) => void
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => void
  loginWithGoogleSSO: (location: string | null, role: 'buyer' | 'seller') => Promise<void>
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
      const { user } = await api<{ user: User }>('/api/auth/me')
      setUser(user)
    } catch (e) {
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
  }

  const loginWithGoogle = () => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    window.location.href = `${API_BASE}/api/auth/google`
  }

  const loginWithGoogleSSO = async (location: string | null, userRole: 'buyer' | 'seller') => {
    // Load Google API
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        // @ts-ignore
        if (window.google?.accounts?.id) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '783256127646-8j8tpmpfnk2r16j5h5o0b5l8s09pqt98.apps.googleusercontent.com',
            callback: async (response: any) => {
              try {
                if (!response.credential) {
                  reject(new Error('No credential received'))
                  return
                }
                
                // Send token to backend
                const result = await api<{ user: User }>('/api/auth/google', {
                  method: 'POST',
                  body: JSON.stringify({
                    idToken: response.credential,
                    role: userRole,
                    location: location,
                  }),
                })
                
                setUser(result.user)
                resolve()
              } catch (err: any) {
                reject(err)
              }
            },
          })
          
          // Trigger the OAuth flow
          // @ts-ignore
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            { theme: 'outline', size: 'large' }
          )
          
          // Use the token flow instead
          // @ts-ignore
          window.google.accounts.id.requestIdToken(() => {})
        }
      }
      
      document.head.appendChild(script)
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
    await api('/api/auth/register', {
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
  }

  const value = useMemo(
    () => ({ user, role, setRole, login, loginWithGoogle, loginWithGoogleSSO, logout, register, isLoading }),
    [user, role, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}