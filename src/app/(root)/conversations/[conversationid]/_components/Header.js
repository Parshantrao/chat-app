

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ArrowLeftCircle, Phone, Settings, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import RemoveFriendDialog from './dialogs/RemoveFriendDialog'

function Header({ imageUrl, username, options }) {
    return (
        <Card className=" w-full rounded-lg flex flex-row items-center justify-between p-2">
            <div className='flex flex-row items-center justify-center gap-2'>
                <Link href={"/conversations"} className='lg:hidden '><ArrowLeftCircle className='w-8 h-8' /></Link>
                <Avatar>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        {username.substring(0, 1)}
                    </AvatarFallback>
                </Avatar>
                <h2 className='font-semibold'>{username || ""}</h2>
            </div>

            <div className='flex gap-2'>
                {
                    options ? <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="secondary" size="icon">
                                <Settings />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {options.map((option, idx) => <DropdownMenuItem key={idx} onClick={option.onClick} className={cn("font-semibold", {
                                "text-destructive": option.desctructive
                            })}>
                                {option.label}
                            </DropdownMenuItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu> : null
                }
                <Button variant="outline" size="icon">
                    <Phone />
                </Button>
                <Button variant="outline" size="icon">
                    <Video />
                </Button>
            </div>
            <RemoveFriendDialog />
        </Card>
    )
}

export default Header