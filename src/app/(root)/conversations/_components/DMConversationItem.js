import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function DMConversationItem({
    id, imageurl, username, lastMessageSender=null, lastMessageContent=null,unseenCount
}) {
    console.log(id, imageurl, username, lastMessageSender=null, lastMessageContent=null)
    return (
        <Link href={`/conversations/${id}`} className='w-full'>
            <Card className="p-2 flex flex-row items-center justify-between truncate">
                <div className='flex flex-row items-center gap-4 truncate'>
                    <Avatar>
                        <AvatarImage src={imageurl} />
                        <AvatarFallback ><User /></AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col truncate'>
                        <h4 className='truncate'>
                            {username}
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

export default DMConversationItem