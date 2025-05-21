import React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import {  Trash2 } from 'lucide-react'
interface DeleteUserButtonProps {
  onDelete: () => void
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ onDelete }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-red-600 hover:underline">
            <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserButton
