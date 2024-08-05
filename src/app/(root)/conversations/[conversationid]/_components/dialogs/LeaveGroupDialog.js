'use client'
import { useMutationState } from '@/hooks/useMutationState'
import React from 'react'
import { api } from '../../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

function LeaveGroupDialog({
    conversationId, open, setOpen
}) {
    const { mutate: leaveGroup, pending } = useMutationState(api.conversation.leaveGroup)

    const handleLeaveGroup = async () => {
        leaveGroup({ id: conversationId }).then(() => {
            toast.success("Group Left")
        }).catch(err => toast.error(err instanceof ConvexError ? err.data : "Unexpected error occurred"))
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You will not be able to see any previous messages or sent new messages to this group
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={pending} onClick={handleLeaveGroup}>Leave</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default LeaveGroupDialog