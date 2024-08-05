import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMutationState } from '@/hooks/useMutationState'
import { ArrowBigRight, Plus, SendHorizonal } from 'lucide-react'
import React, { useRef } from 'react'
import { z } from 'zod'
import { api } from '../../../../../../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConversation } from '@/hooks/useConversation'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import ReactTextareaAutosize from 'react-textarea-autosize'


const chatMessageSchema = z.object({
  text: z.string().min(1, { message: "Message field can't be empty" })
})

function ChatInput() {
  const textAreaRef = useRef(null)
  const { conversationId } = useConversation()
  const { mutate: createMessage, pending } = useMutationState(api.message.create)

  const { register,setValue, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(chatMessageSchema), defaultValues: { text: "" } })

  const onSubmit = async ({ text }) => {
    console.log(text)
    createMessage({ conversationId, type: 'text', content: [text] }).then(() => {
      reset()
    }).catch(err =>
      toast.error(err instanceof ConvexError ? err.data : "Unexpected error occurred")
    )
  }

  const handleInputChange=(e)=>{
    const {value,selectionStart}=e.target
    if(selectionStart !==null){
      setValue("text",value)
    }
  }

  return (
    <Card className="w-full p-2 rounded-lg relative flex flex-row gap-3 ">
      <Button variant="outline" size="icon"><Plus /></Button>
      <form className='flex w-full' onSubmit={handleSubmit(onSubmit)}>
       
        <ReactTextareaAutosize className='min-h-full w-full p-1.5 resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground' onKeyDown={async e=>{
          if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            await handleSubmit(onSubmit)()
          }
        }} maxRows={3}
         {...register("text")} placeholder='Type a message...' onChange={handleInputChange} onClick={handleInputChange} />
        {errors.text && (
          <p className="text-red-500 text-sm mt-1 ml-2">{errors.text.message}</p>
        )}
        <Button disabled={pending} type="submit" variant="primary" size="icon"><SendHorizonal /></Button>
      </form>
    </Card>
  )
}

export default ChatInput