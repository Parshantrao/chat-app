import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const getMessages = query({
    args: {
        id: v.id("conversations")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized")
        }


        const currentUser = await getUserByClerkId(ctx, identity.subject);

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversationMember = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", args.id)).unique()

        if (!conversationMember) {
            throw new ConvexError("You aren't a member of this conversation")
        }

        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("converationId", args.id)).order("desc").collect()

        let messagesWithSender = Promise.all(messages.map(async (message) => {
            const messageSender = await ctx.db.get(message.senderId);

            if (!messageSender) {
                throw new ConvexError("Could not find sender of message")
            }

            return {
                message,
                senderImage: messageSender.imager_url,
                senderName: messageSender.user_name,
                isCurrentUser: messageSender._id === currentUser._id
            }
        }))

        return messagesWithSender
    }
})