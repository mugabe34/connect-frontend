import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin'

type AuthContextValue = {
  user: User | null
  role: UserRole
  setRole: (role: UserRole) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<void>
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

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const register = async (name: string, email: string, password: string, role: 'buyer' | 'seller') => {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
  }

  const value = useMemo(
    () => ({ user, role, setRole, login, logout, register, isLoading }),
    [user, role, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}