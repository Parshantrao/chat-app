import { Card } from '@/components/ui/card'
import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Check, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '../../../../../convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'

function Request({ imageUrl, id, username, email }) {
    const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deleteRequest)

    const { mutate: acceptRequest, pending: acceptPending } = useMutationState(api.request.acceptRequest)


    return (
        <Card
            className="w-full p-2 flex flex-row items-center justify-between gap-2"
        >
            <div className='flex items-center gap-4 truncate'>
                <Avatar>
                    <AvatarImage src={imageUrl} alt="@shadcn" />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className='flex flex-col truncate'>

                    <h4 className='truncate'>{username}</h4>
                    <p className='text-xs text-muted-foreground truncate'>{email}</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button size='icon' disabled={acceptPending} onClick={() => {
                    acceptRequest({ id }).then(() => toast.success("Friend request accepted")).catch(err => {
                        toast.error(err instanceof ConvexError ? err.data : "Unexpected error occured")
                    })
                }}><Check /></Button>
                <Button size='icon' disabled={denyPending} variant='destructive' onClick={() => {
                    denyRequest({ id }).then(() => toast.success("Friend request denied")).catch(err => {
                        toast.error(err instanceof ConvexError ? err.data : "Unexpected error occured")
                    })
                }}><X className='h-4 w-4' /></Button>
            </div>
        </Card>
    )
}

export default Request