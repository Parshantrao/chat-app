'use client'
import ConversationFallback from '@/components/conversation/ConversationFallback'
import ItemList from '@/components/item-list/ItemList'
import React, { useEffect, useState } from 'react'
import AddFriendDialog from './_components/AddFriendDialog'
import { api } from '../../../../convex/_generated/api'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import Request from './_components/Request'


function FriendsPage() {

  const requests = useQuery(api.requests.getRequest)
 

  return (
    <>
      <ItemList title="Friends" action={
        <AddFriendDialog />
      }> 
      {requests?
        requests.length===0?<p className='w-full h-full flex items-center justify-center'>No friend requests found</p> :
        requests.map(request=><Request key={request.request._id} id={request.request._id} imageUrl={request.sender.image_url} email={request.sender.email} username={request.sender.user_name} />)
      :<Loader2 className='h-8 w-8' />}
      </ItemList>
      <ConversationFallback />
    </>
  )
}

export default FriendsPage