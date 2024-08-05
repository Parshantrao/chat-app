'use client'

import { useMutation } from "convex/react"
import { useState } from "react"

export const useMutationState =  (mutationToRun)=>{
    const [pending,setPending]=useState(false)

    const mutationFn = useMutation(mutationToRun)

    const mutate =async (payload)=>{
        setPending(true)

        return mutationFn(payload).then((res)=>res).catch(err=>{throw err}).finally(()=>setPending(false))
    }
    return {mutate,pending}
}