'use client'
import ItemList from '@/components/item-list/ItemList'
import { useQuery } from 'convex/react'
import React, { useMemo } from 'react'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import DMConversationItem from './_components/DMConversationItem'
import CreateGroupDialog from './_components/CreateGroupDialog'
import GroupConversationItem from './_components/GroupConversationItem'

function ConversationsLayout({ children }) {

  const conversations = useQuery(api.conversations.getConversations)

  const unseenMessagesCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount
    }, 0)
  }, [conversations])

  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog />}>
        {
          conversations ?
            conversations.length === 0 ? <p className='h-full w-full flex items-center justify-center'>No Conversations found</p> :
              conversations.map((conversation, idx) => {
                
                return conversation.conversation.isGroup ?
                  <GroupConversationItem
                    key={conversation.conversation._id}
                    name={conversation.conversation.name}
                    id={conversation.conversation._id}
                    lastMessageContent={conversation.isLastMessage?.content} lastMessageSender={conversation.isLastMessage?.sender}
                    unseenCount={conversation.unseenCount}
                  /> :
                  <DMConversationItem key={conversation.conversation._id} username={conversation.otherMember.user_name || ""} imageurl={conversation.otherMember.image_url || ""} id={conversation.conversation._id} lastMessageContent={conversation.isLastMessage?.content} lastMessageSender={conversation.isLastMessage?.sender}
                    unseenCount={conversation.unseenCount}
                  />
              })
            : <Loader2 />
        }
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout