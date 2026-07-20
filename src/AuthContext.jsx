import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Stellt den eingeloggten User überall in der App zur Verfügung
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Hört auf Login/Logout und hält currentUser aktuell
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Zugriff auf currentUser/authLoading/logout in jeder Komponente
export function useAuth() {
  return useContext(AuthContext)
}