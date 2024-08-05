
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function GroupConversationItem({
    id, name, lastMessageSender=null, lastMessageContent=null,unseenCount
}) {
    
    return (
        <Link href={`/conversations/${id}`} className='w-full'>
            <Card className="p-2 flex flex-row items-center justify-between truncate">
                <div className='flex flex-row items-center gap-4 truncate'>
                    <Avatar>
                       
                        <AvatarFallback >{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col truncate'>
                        <h4 className='truncate'>
                            {name}
                        </h4>
                        {lastMessageContent && lastMessageContent ? <span className='text-sm text-muted-foreground truncate flex overflow-ellipsis'>
                            <p className='font-semibold'>{lastMessageSender}{":"}&nbsp; </p>
                            <p className='truncate overflow-ellipsis'>{lastMessageContent} </p>
                        </span>:""}
                    </div>
                </div>
                {unseenCount ? <Badge>{unseenCount}</Badge>:null}
            </Card>
        </Link>
    )
}

export default GroupConversationItem