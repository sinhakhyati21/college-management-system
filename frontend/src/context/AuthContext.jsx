import { createContext, useContext, useEffect, useState } from "react"
import api from "../api";  

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser")
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
      }
    } catch (err) {
      localStorage.removeItem("authUser")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (data) => {
    setUser(data.user)
    localStorage.setItem("authUser", JSON.stringify(data))
  }

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout")
    } catch {}
    setUser(null)
    localStorage.removeItem("authUser")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        selectedRole,
        setSelectedRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)