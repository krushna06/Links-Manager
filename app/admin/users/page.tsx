'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Trash2, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: string
  lastSignInTime: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to fetch users. Please try again later.')
      }
    }

    fetchUsers()
  }, [])

  const deleteUser = async (uid: string) => {
    try {
      const response = await fetch(`/api/admin/users/${uid}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      setUsers(users.filter(user => user.uid !== uid))
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user. Please try again later.')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User List</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>{user.displayName || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(user.lastSignInTime).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                      <Info className="mr-2 h-4 w-4" />
                      <span>View Info</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteUser(user.uid)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete User</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedUser.photoURL} alt={selectedUser.displayName} />
                <AvatarFallback>{selectedUser.displayName?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{selectedUser.displayName || 'N/A'}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">Created: {new Date(selectedUser.createdAt).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Last Sign In: {new Date(selectedUser.lastSignInTime).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

