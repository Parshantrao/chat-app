'use client'
import ConversationContainer from '@/components/conversation/ConversationContainer'
import React, { useState } from 'react'
import Header from './_components/Header'
import ChatInput from './_components/input/ChatInput'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Body from './_components/body/Body'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'

function ConversationPage({ params }) {
  const conversation = useQuery(api.conversation.getConversation, { id: params.conversationid })

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
  const [callType, setCallType] = useState(["audio" || "video" || null])

  if (conversation === undefined) {
    return <div className='w-full h-full flex items-center justify-center'>
      <Loader2 className='w-8 h-8' />
    </div>
  }

  if (conversation === null) {
    return <div className='w-full h-full flex items-center justify-center'>
      <p>Conversation not found</p>
    </div>
  }
  return (
    <ConversationContainer >
      <Header
        username={conversation.isGroup ? conversation.name : conversation.otherMember.user_name}
        imageUrl={conversation.isGroup ? null : conversation.otherMember.image_url}
        options={conversation.isGroup ? [
          {
            label: "Leave group",
            desctructive: false,
            onClick: () => setLeaveGroupDialogOpen(true)
          },
          {
            label: "Delete group",
            desctructive: true,
            onClick: () => setDeleteGroupDialogOpen(true)
          },
        ] : [
          {
            label: "Remove Friend",
            desctructive: true,
            onClick: () => setRemoveFriendDialogOpen(true)
          },
        ]}
      />
      <Body members={conversation.isGroup ?
        conversation.otherMembers ? conversation.otherMembers : [] :
        conversation.otherMember ? [conversation.otherMember] : []} />
      <ChatInput />
      <RemoveFriendDialog conversationId={params.conversationid} open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen} />
      <DeleteGroupDialog conversationId={params.conversationid} open={deleteGroupDialogOpen} setOpen={setDeleteGroupDialogOpen} />
      <LeaveGroupDialog conversationId={params.conversationid} open={leaveGroupDialogOpen} setOpen={setLeaveGroupDialogOpen} />
    </ConversationContainer>
  )
}

export default ConversationPage