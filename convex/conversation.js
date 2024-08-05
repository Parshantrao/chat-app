import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";




export const getConversation = query({
    args: {
        id: v.id('conversations')
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

        const conversation = await ctx.db.get(args.id)

        if (!conversation) {
            throw new ConvexError("Conversation not found")
        }

        const membership = await ctx.db.query('conversationMembers').withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)).collect()

        if (!membership) {
            throw new ConvexError("You aren't a member of this conversation")
        }

        const allConversationMember = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.id)).collect()

        if (!conversation.isGroup) {
            const otherMembership = allConversationMember.filter(membership => membership.memberId !== currentUser._id)[0]

            const otherMemberDetails = await ctx.db.get(otherMembership.memberId)

            return {
                ...conversation, otherMember: {
                    ...otherMemberDetails,
                    lastSeenMessageId: otherMembership.lastSeenMessage
                }, otherMembers: null
            };
        }
        else {
            const otherMembers = await Promise.all(
                allConversationMember.filter(membership => membership.memberId !== currentUser._id).map(async member => {
                    const memberDetails = await ctx.db.get(member.memberId)
                    if (!member) {
                        throw new ConvexError("Member could not be found")
                    }
                    return {
                        _id:member._id,
                        username: memberDetails.user_name
                    }
                })
            )

            return {
                ...conversation, otherMembers, otherMember: null
            }
        }
    }
})

export const createGroup = mutation({
    args: {
        members: v.array(v.id("users")),
        name: v.string()
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

        const conversationId = await ctx.db.insert("conversations", {
            name: args.name,
            isGroup: true
        })

        await Promise.all([...args.members, currentUser._id].map(async memberId => {
            await ctx.db.insert("conversationMembers", {
                memberId: memberId,
                conversationId: conversationId
            })
        }))
    }
})

export const deleteGroup = mutation({
    args: {
        id: v.id('conversations')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized")
        }

        if (identity.email === args.email) {
            throw new ConvexError("Can't send a request to yourself")
        }

        const currentUser = await getUserByClerkId(ctx, identity.subject)

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversation = await ctx.db.get(args.id)

        if (!conversation) {
            throw new ConvexError("Conversation could not be found")
        }

        const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId", q => q.eq("conversationId", args.id)).collect()

        if (!memberships || memberships.length <= 1) {
            throw new ConvexError("This conversation does not have any memebers")
        }


        const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("converationId", args.id)).collect()

        await ctx.db.delete(args.id) // conversation deleted


        await Promise.all(memberships.map(async membership => {
            await ctx.db.delete(membership._id)
        }))

        Promise.all(messages.map(async message => {
            await ctx.db.delete(message._id)
        }))
    }

})

export const leaveGroup = mutation({
    args: {
        id: v.id('conversations')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized")
        }

        if (identity.email === args.email) {
            throw new ConvexError("Can't send a request to yourself")
        }

        const currentUser = await getUserByClerkId(ctx, identity.subject)

        if (!currentUser) {
            throw new ConvexError("User not found")
        }

        const conversation = await ctx.db.get(args.id)

        if (!conversation) {
            throw new ConvexError("Conversation could not be found")
        }

        const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", args.id)).unique()

        if (!membership) {
            throw new ConvexError("You are not member of this group")
        }

        await ctx.db.delete(membership._id)
    }

})

export const markRead = mutation({
    args: {
        id: v.id('conversations'),
        messageId: v.id("messages")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Unauthorized")
        }

        if (identity.email === args.email) {
            throw new ConvexError("Can't send a request to yourself")
        }

        const currentUser = await getUserByClerkId(ctx, identity.subject)

        if (!currentUser) {
            throw new ConvexError("User not found")
        }



        const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId", q => q.eq("memberId", currentUser._id).eq("conversationId", args.id)).unique()

        if (!membership) {
            throw new ConvexError("You are not member of this group")
        }

        const lastMessage = await ctx.db.get(args.messageId)

        await ctx.db.patch(membership._id, { lastSeenMessage: lastMessage ? lastMessage._id : undefined })
    }

})