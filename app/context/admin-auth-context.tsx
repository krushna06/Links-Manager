"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

interface AdminAuthContextType {
  isAdminLoggedIn: boolean
  loginAdmin: (username: string, password: string) => Promise<boolean>
  logoutAdmin: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdminLoggedIn: false,
  loginAdmin: async () => false,
  logoutAdmin: () => {},
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminLoggedIn = Cookies.get("adminLoggedIn") === "true"
      setIsAdminLoggedIn(adminLoggedIn)
    }

    checkAdminAuth()
  }, [])

  const loginAdmin = async (username: string, password: string) => {
    if (username === "admin" && password === "1234") {
      Cookies.set("adminLoggedIn", "true", { expires: 7 }) // Set cookie to expire in 7 days
      setIsAdminLoggedIn(true)
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    Cookies.remove("adminLoggedIn")
    setIsAdminLoggedIn(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

