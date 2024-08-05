"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '../../../../../convex/_generated/api'
import { ConvexError } from 'convex/values'
import { toast } from 'sonner'

const emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" })
});



function AddFriendDialog() {
    const { mutate: createRequest, pending } = useMutationState(api.request.createRequest);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(emailSchema),
    });

    const onSubmit = async ({ email }) => {
        await createRequest({ email: email }).then(() => {reset()
            toast.success("Friend request sent")
        })
            .catch(err => {
                const errorMessage = err instanceof ConvexError ? err.data : "Unexpected error occured"

                toast.error(errorMessage)
            })
    };

    return (

        <Dialog>
            <Tooltip>
                <TooltipTrigger>
                    <Button size="icon" variant="outline">
                        <DialogTrigger> <UserPlus className="cursor-pointer" /></DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Add Friend</TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>
                        Send a request to connect with your friend
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-md mx-auto bg-white rounded-md">
                    <div className="mb-4">

                        <input
                            type="email"
                            id="email"
                            placeholder='Email...'
                            {...register("email")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500 focus:ring-0' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button disabled={pending} type="submit">Send</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>


    )
}

export default AddFriendDialog