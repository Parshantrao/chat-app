'use client'
import React from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'
import { useConversation } from '@/hooks/useConversation'

function ItemList({children,title,action}) {
  const {isActive} = useConversation()

  return (
    <Card className={cn("hidden h-full w-full lg:flex-none lg:w-80 p-2",{
      "block": !isActive, 
      "lg:block":isActive
    })}>
        <div className='mb-4 flex items-center justify-between'>
            <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
            {action?action:null}
        </div>
        <div className='w-full h-full flex flex-col items-center justify-start gap-2'>
            {children}
        </div>
    </Card>
  )
}

export default ItemList