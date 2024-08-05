'use client'
import { useMutationState } from '@/hooks/useMutationState'
import React from 'react'
import { api } from '../../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { AlertCircle } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

function RemoveFriendDialog({
    conversationId, open, setOpen
}) {
    const { mutate: removeFriend, pending } = useMutationState(api.friend.deleteFriend)

    const handleRemoveFriend = async () => {
        removeFriend({ id: conversationId }).then(() => {
            toast.success("Removed friend")
        }).catch(err => toast.error(err instanceof ConvexError ? err.data : "Unexpected error occurred"))
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All messages will be deleted and you will not be able to message this user. All group chats will still work as normal
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={pending} onClick={handleRemoveFriend}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default RemoveFriendDialog