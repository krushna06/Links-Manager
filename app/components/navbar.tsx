'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/auth-context'
import { useAdminAuth } from '../context/admin-auth-context'
import { ThemeSwitcher } from './theme-switcher'
import { useState, useEffect } from 'react'
import { Home, User, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { isAdminLoggedIn, logoutAdmin } = useAdminAuth()
  const [scrolled, setScrolled] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    if (isAdminLoggedIn) {
      logoutAdmin()
      router.push('/admin/login')
    } else {
      try {
        await signOut(auth)
        router.push('/')
      } catch (error) {
        console.error('Failed to log out', error)
      }
    }
  }

  if (loading) {
    return null // or a loading spinner
  }

  return (
    <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled ? 'bg-background/70 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">Link Manager</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user && pathname === '/' && !isAdminLoggedIn && (
            <Link href="/links">
              <Button variant="ghost" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                My Links
              </Button>
            </Link>
          )}
          {isAdminLoggedIn && (
            <Link href="/admin">
              <Button variant="ghost" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          )}
          <ThemeSwitcher />
          {user || isAdminLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={isAdminLoggedIn ? undefined : user?.photoURL || undefined} alt={isAdminLoggedIn ? 'Admin' : user?.displayName || ''} />
                    <AvatarFallback>{isAdminLoggedIn ? 'A' : user?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{isAdminLoggedIn ? 'Admin' : user?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isAdminLoggedIn ? 'Administrator' : user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Info</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAdminLoggedIn ? 'Admin Information' : 'User Information'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={isAdminLoggedIn ? undefined : user?.photoURL || undefined} alt={isAdminLoggedIn ? 'Admin' : user?.displayName || ''} />
              <AvatarFallback>{isAdminLoggedIn ? 'A' : user?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{isAdminLoggedIn ? 'Admin' : user?.displayName}</h3>
              <p className="text-sm text-muted-foreground">{isAdminLoggedIn ? 'Administrator' : user?.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}

