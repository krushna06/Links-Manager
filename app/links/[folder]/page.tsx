'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Pencil, Trash2, FolderPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '../../context/auth-context'

interface LinkItem {
  _id: string
  name: string
  link: string
  user: string
  folderId: string | null
}

interface FolderItem {
  _id: string
  name: string
  user: string
}

export default function FolderLinks({ params }: { params: { folder: string } }) {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [folder, setFolder] = useState<FolderItem | null>(null)
  const [newLink, setNewLink] = useState({ name: '', link: '' })
  const [editLink, setEditLink] = useState<LinkItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [addLinkOpen, setAddLinkOpen] = useState(false)
  const [moveLinkOpen, setMoveLinkOpen] = useState(false)
  const [moveTarget, setMoveTarget] = useState<LinkItem | null>(null)
  const [movePath, setMovePath] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault()
      setAddLinkOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchLinks()
      fetchFolder()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, handleKeyDown, user, params.folder])

  const fetchLinks = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/links?userId=${user.uid}&folderId=${params.folder}`)
      if (!response.ok) throw new Error('Failed to fetch links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    }
  }

  const fetchFolder = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/folders/${params.folder}`)
      if (!response.ok) throw new Error('Failed to fetch folder')
      const data = await response.json()
      setFolder(data)
    } catch (error) {
      console.error('Error fetching folder:', error)
    }
  }

  const addLink = async () => {
    if (newLink.name && newLink.link && user) {
      try {
        const response = await fetch('/api/links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newLink, user: user.uid, folderId: params.folder }),
        })
        if (!response.ok) throw new Error('Failed to add link')
        const addedLink = await response.json()
        setLinks([...links, addedLink])
        setNewLink({ name: '', link: '' })
        setAddLinkOpen(false)
      } catch (error) {
        console.error('Error adding link:', error)
      }
    }
  }

  const updateLink = async () => {
    if (editLink) {
      try {
        const response = await fetch(`/api/links/${editLink._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editLink),
        })
        if (!response.ok) throw new Error('Failed to update link')
        const updatedLink = await response.json()
        setLinks(links.map(link => link._id === updatedLink._id ? updatedLink : link))
        setEditLink(null)
      } catch (error) {
        console.error('Error updating link:', error)
      }
    }
  }

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete link')
      setLinks(links.filter(link => link._id !== id))
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const moveLink = async () => {
    if (moveTarget && movePath) {
      const targetFolderId = movePath === '../' || './' || '..' ? null : params.folder
      try {
        const response = await fetch(`/api/links/${moveTarget._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...moveTarget, folderId: targetFolderId }),
        })
        if (!response.ok) throw new Error('Failed to move link')
        const updatedLink = await response.json()
        setLinks(links.filter(link => link._id !== updatedLink._id))
        setMoveTarget(null)
        setMovePath('')
        setMoveLinkOpen(false)
      } catch (error) {
        console.error('Error moving link:', error)
      }
    }
  }

  const filteredLinks = useMemo(() => {
    return links.filter(link => 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.link.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [links, searchQuery])

  return (
    <main className="p-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Links in {folder?.name || 'Loading...'}</h1>
        <div className="flex space-x-2">
          <Link href="/links">
            <Button variant="outline">Back to Links</Button>
          </Link>
          <Dialog open={addLinkOpen} onOpenChange={setAddLinkOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setAddLinkOpen(true)}>Add Link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newLink.name}
                    onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link" className="text-right">URL</Label>
                  <Input
                    id="link"
                    value={newLink.link}
                    onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={addLink}>Add Link</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-lg">Currently Viewing: /links/{folder?.name || 'Loading...'}</p>
      </div>
      <Input
        type="text"
        placeholder="Search links..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {links.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link Name</TableHead>
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.map((link) => (
              <TableRow key={link._id}>
                <TableCell>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="font-medium">
                    {link.name}
                  </a>
                </TableCell>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            setEditLink(link);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Link</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">Name</Label>
                              <Input
                                id="edit-name"
                                value={editLink?.name || ''}
                                onChange={(e) => setEditLink(editLink ? { ...editLink, name: e.target.value } : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-url" className="text-right">URL</Label>
                              <Input
                                id="edit-url"
                                value={editLink?.link || ''}
                                onChange={(e) => setEditLink(editLink ? { ...editLink, link: e.target.value } : null)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button onClick={() => {
                            updateLink();
                            setEditLink(null);
                          }}>Update Link</Button>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuItem onClick={() => {
                        setMoveTarget(link)
                        setMoveLinkOpen(true)
                      }}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        <span>Move</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteLink(link._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">This folder is empty. Add some links to get started!</p>
        </div>
      )}
      <Dialog open={moveLinkOpen} onOpenChange={setMoveLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="move-path" className="text-right">Path</Label>
              <Input
                id="move-path"
                value={movePath}
                onChange={(e) => setMovePath(e.target.value)}
                placeholder="/links/{folder_name} or .."
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={moveLink}>Move Link</Button>
        </DialogContent>
      </Dialog>
    </main>
  )
}

