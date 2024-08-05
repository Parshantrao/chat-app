import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const getConversations = query({
    args: {
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

        const conversationMemberships = await ctx.db.query('conversationMembers').withIndex("by_memberId", q => q.eq("memberId", currentUser._id)).collect()

        const conversations = await Promise.all(
            conversationMemberships?.map(async membership => {
                const conversation = await ctx.db.get(membership.conversationId)
                if (!conversation) {
                    throw new ConvexError("Conversation could not be found")
                }
                return conversation
            })
        )

        const conversationsWithDetails = await Promise.all(conversations.map(async (conversation, idx) => {
            const allconversationMemberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", conversation._id)).collect()

            const isLastMessage = await getLastMessageDetails({ ctx, id: conversation.lastMessageId })

            const lastSeenMessage = conversationMemberships[idx].lastSeenMessage ? await ctx.db.get(conversationMemberships[idx].lastSeenMessage) : null

            const lastSeenMessageTime = lastSeenMessage ? lastSeenMessage._creationTime : -1

            const unseenMessages = await ctx.db.query("messages").withIndex("by_conversationId",q=>q.eq("converationId",conversation._id)).filter(q=>q.gt(q.field("_creationTime"),lastSeenMessageTime)).filter(q=>q.neq(q.field("senderId"),currentUser._id)).collect()

            if (conversation.isGroup) {
                return { conversation, isLastMessage,unseenCount:unseenMessages.length }
            } else {
                const otherMembership = allconversationMemberships.filter(membership => membership.memberId != currentUser._id)[0]

                const otherMember = await ctx.db.get(otherMembership.memberId);

                return { conversation, otherMember, isLastMessage,unseenCount:unseenMessages.length }
            }
        }))

        return conversationsWithDetails


    }
})

const getLastMessageDetails = async ({ ctx, id }) => {
    if (!id) return null

    const message = await ctx.db.get(id)

    if (!message) return null

    const sender = await ctx.db.get(message.senderId)

    if (!sender) return null

    const content = await getMessageContent(message.type, message.content)

    return {
        content,
        sender: sender.user_name
    }
}

async function getMessageContent(type, content) {
    switch (type) {
        case "text":
            return await content;
        default:
            return "[non-text]"
    }
}