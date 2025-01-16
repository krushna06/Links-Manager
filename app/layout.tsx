import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from './components/navbar'
import { Providers } from './providers'
import { AuthProvider } from './context/auth-context'
import { AdminAuthProvider } from './context/admin-auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Link Manager',
  description: 'A project by n0step_',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminAuthProvider>
            <Providers attribute="class" defaultTheme="system" enableSystem>
              <Navbar />
              {children}
            </Providers>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

