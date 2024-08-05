import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const getRequest = query({
    args:{
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new ConvexError("Unauthorized")
        }


        const currentUser = await getUserByClerkId(ctx,identity.subject);

        if(!currentUser){
            throw new ConvexError("User not found")
        }

        const requests = await ctx.db.query("requests").withIndex("by_receiver",(q)=>q.eq("receiver",currentUser._id)).collect()

        const requestWithSender = await Promise.all(
            requests.map(async(request)=>{
                const sender= await ctx.db.get(request.sender)
                if(!sender){
                    throw new ConvexError("Request sender could not be found")
                }
                return {sender,request}
            })
        )
        return requestWithSender
    }
})

export const requestCount = query({args:{},handler:async(ctx,args)=>{
    const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new ConvexError("Unauthorized")
        }


        const currentUser = await getUserByClerkId(ctx,identity.subject);
        
        if(!currentUser){
            throw new ConvexError("User not found")
        }

        const requestsLength = await ctx.db.query("requests").withIndex("by_receiver",(q)=>q.eq("receiver",currentUser._id)).collect();

        return requestsLength.length
}})