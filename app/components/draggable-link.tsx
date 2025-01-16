'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkItem {
  id: string
  name: string
  url: string
}

interface DraggableLinkProps {
  link: LinkItem
  updateLink: (updatedLink: LinkItem) => void
  deleteLink: (id: string) => void
}

export function DraggableLink({ link, updateLink, deleteLink }: DraggableLinkProps) {
  const [editLink, setEditLink] = useState<LinkItem | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(link))
  }

  return (
    <div draggable onDragStart={handleDragStart} className="flex items-center justify-between p-2 bg-card rounded-md mb-2">
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium">
        {link.name}
      </a>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mr-2" onClick={() => setEditLink(link)}>
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editLink?.name}
                  onChange={(e) => setEditLink(editLink ? { ...editLink, name: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={editLink?.url}
                  onChange={(e) => setEditLink(editLink ? { ...editLink, url: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={() => {
              if (editLink) {
                updateLink(editLink)
                setEditLink(null)
              }
            }}>Update Link</Button>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={() => deleteLink(link.id)}>
          Delete
        </Button>
      </div>
    </div>
  )
}

