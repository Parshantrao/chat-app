import { ConvexError, v } from "convex/values";
import {  query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const getFriends = query({
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

        const friendship1 = await ctx.db.query("friends").withIndex("by_user1", q => q.eq("user1", currentUser._id)).collect()

        const friendship2 = await ctx.db.query("friends").withIndex("by_user2", q => q.eq("user2", currentUser._id)).collect()

        const friendships = [...friendship1, ...friendship2]

        const friends = await Promise.all(
            friendships.map(async friend => {
                const friendDetails = await ctx.db.get(friend.user1 === currentUser._id ? friend.user2 : friend.user1)

                if (!friendDetails) {
                    throw new ConvexError("Friend could not be found")
                }
                return friendDetails
            })
        )

        return friends
    }
})

