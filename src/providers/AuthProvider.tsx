import { createContext, useContext, useMemo, useState } from 'react'

export type UserRole = 'guest' | 'buyer' | 'seller' | 'admin'

type AuthContextValue = {
  role: UserRole
  setRole: (r: UserRole) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('guest')
  const value = useMemo(() => ({ role, setRole }), [role])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


