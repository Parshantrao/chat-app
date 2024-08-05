'use client'
import { useQuery } from 'convex/react'
import React, { useMemo } from 'react'
import { z } from 'zod'
import { api } from '../../../../../convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CirclePlus, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'

const createGroupFormSchema = z.object({
    name: z.string().min(1, { message: "This field can't be empty" }),
    members: z.string().array().min(1, { message: "You must select atleast 1 friend" })
})

function CreateGroupDialog() {
    const friends = useQuery(api.friends.getFriends);

    const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup)

    const { register, setValue, handleSubmit, formState: { errors }, reset, watch } = useForm({ resolver: zodResolver(createGroupFormSchema), defaultValues: { name: "", members: [] } })

    const members = watch("members", []);
    

    const unselectedFriends = useMemo(() => {
        return friends ? friends.filter(friend => !members.includes(friend._id)) : []
    }, [friends, members])

    const handleCreateGroup = async ({ name, members }) => {
        await createGroup({ name, members }).then(() => {
            reset()
            toast.success("Group created!")
        }).catch((err) => toast.error(err instanceof ConvexError ? err.data : 'Unexpected error occurred'))
    }
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger>
                    <Button size="icon" variant="outline">
                        <DialogTrigger asChild>
                            <CirclePlus />
                        </DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Create Group</TooltipContent>
            </Tooltip>
            <DialogContent className="block">
                <DialogHeader>
                    <DialogTitle>Create group</DialogTitle>
                    <DialogDescription>Add your friends to get started!</DialogDescription>
                </DialogHeader>
                <form className='space-y-8 flex flex-col mt-4' onSubmit={handleSubmit(handleCreateGroup)}>
                    <div className='flex flex-col'>

                        <label>Name</label>
                        <input className='ring-0 outline-0 border-0 selection:ring-0 selection:border-0 ' {...register("name")} placeholder='Group name...' />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 ml-2">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label>Members</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
                                <Button className="w-full" variant="outline">Select</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                {unselectedFriends.map(friend => {
                                    return <DropdownMenuCheckboxItem key={friend._id} className="flex items-center gap-2 w-full p-2" onCheckedChange={checked => {
                                        if (checked) {
                                            setValue("members", [...members, friend._id])
                                        }
                                    }}>
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={friend.image_url} />
                                            <AvatarFallback >
                                                {friend.user_name.substring(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h4 className='truncate'>{friend.user_name}</h4>
                                    </DropdownMenuCheckboxItem>
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {errors.members && (
                            <p className="text-red-500 text-sm mt-1 ml-2">{errors.members.message}</p>
                        )}
                    </div>
                    {
                        members && members.length ? <Card className="flex items-center gap-3 overflow-auto w-full h-24 p-2 no-scrollbar">
                            {
                                friends.filter(friend => members.includes(friend._id)).map(
                                    friend => {
                                        return <div className='flex flex-col items-center gap-1' key={friend._id}>
                                            <div className='relative'>
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={friend.image_url} />
                                                    <AvatarFallback >
                                                        {friend.user_name.substring(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <X className='text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer' onClick={() => setValue("members", members.filter(id => id !== friend._id))} />
                                            </div>
                                            <p className='truncate text-sm'>{friend.user_name.split(" ")[0]} </p>
                                        </div>
                                    }
                                )
                            }
                        </Card> : null
                    }
                    <AlertDialogFooter>
                        <Button disabled={pending} type="submit">Create</Button>
                    </AlertDialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGroupDialog