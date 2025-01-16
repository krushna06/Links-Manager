'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/auth-context'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    router.push('/links')
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/links')
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/links')
    } catch (error) {
      setError('Failed to log in with Google. Please try again.')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <div className="text-center">
          Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      </form>
    </main>
  )
}

