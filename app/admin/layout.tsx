'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAdminAuth } from '../context/admin-auth-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, logoutAdmin } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAdminLoggedIn && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAdminLoggedIn, router, pathname])

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  if (!isAdminLoggedIn && pathname !== '/admin/login') {
    return null
  }

  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-background border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  View Users
                </Button>
              </Link>
            </nav>
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="default" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

