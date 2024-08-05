'use client'
import { useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import { api } from '../../../../../../../convex/_generated/api'
import { useConversation } from '@/hooks/useConversation'
import Message from './Message'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMutationState } from '@/hooks/useMutationState'

function Body({ members }) {
  const { conversationId } = useConversation()
  const messages = useQuery(api.messages.getMessages, { id: conversationId })

  const { mutate: markRead, pending } = useMutationState(api.conversation.markRead)

  const getSeenMessage = (messageId) => {
    const seenUsers = members.filter(member => member.lastSeenMessageId === messageId).map(user => user.user_name.split(" ")[0])

    if (seenUsers.length === 0) return undefined

    return formatSeenBy(seenUsers)
  }

  const formatSeenBy = (seenUsers) => {
    switch (seenUsers.length) {
      case 1:
        return <p className='text-muted-foreground text-sm text-right'>{
          `Seen by ${seenUsers[0]}`
        }</p>
      case 2:
        return <p className='text-muted-foreground text-sm text-right'>{
          `Seen by ${seenUsers[0]} and ${seenUsers[1]}`
        }</p>
      default:
        return <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className='text-muted-foreground text-sm text-right'>{
                `Seen by ${seenUsers[0]}, ${seenUsers[1]} and ${seenUsers.length-2} more`
              }</p>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                {seenUsers.map((name,idx)=>{
                  return <li key={idx}>{name}</li>
                })}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    }

  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        id: conversationId,
        messageId: messages[0].message._id
      })
    }
  }, [conversationId, markRead, messages])
  return (
    <div className='flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar'>{
      messages?.map(({ message, senderImage, senderName, isCurrentUser }, idx) => {
        const lastByUser = messages[idx - 1]?.message.senderId === messages[idx]
          .message.senderId

        const seenMessage = isCurrentUser ? getSeenMessage(message._id) : undefined
        return <Message key={message._id} lastByUser={lastByUser} senderImage={senderImage} senderName={senderName} content={message.content} fromCurrentUser={isCurrentUser} createdAt={message._creationTime} type={message.type} seen={seenMessage} />
      })
    }</div>
  )
}

export default Body