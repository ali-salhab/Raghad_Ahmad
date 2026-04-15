import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('adminToken')
  })

  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        setToken(null)
        localStorage.removeItem('adminToken')
      })
    }
  }, [token])

  async function login(password: string) {
    const { data } = await axios.post('/api/auth/login', { password })
    setToken(data.token)
    localStorage.setItem('adminToken', data.token)
  }

  function logout() {
    setToken(null)
    localStorage.removeItem('adminToken')
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
