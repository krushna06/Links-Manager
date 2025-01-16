'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdminLoggedIn: false,
  loginAdmin: async () => false,
  logoutAdmin: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      setIsAdminLoggedIn(adminLoggedIn);
    };

    checkAdminAuth();
    window.addEventListener('storage', checkAdminAuth);

    return () => {
      window.removeEventListener('storage', checkAdminAuth);
    };
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('adminLoggedIn', 'true');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

