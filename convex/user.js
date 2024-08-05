const { v } = require("convex/values");
const { mutation, internalMutation, internalQuery } = require("./_generated/server");


export const createUser = internalMutation({
    args: {
        user_name: v.string(),
        image_url: v.string(),
        user_clerkId: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        const newUserData = await ctx.db.insert("users", args);
        return {
            data: newUserData
        }
    },
});

export const updateUser = internalMutation({
    args:{
        id:v.id("users"),
        user_name: v.string(),
        image_url: v.string(),
        user_clerkId: v.string(),
        email: v.string()
    },
    handler:async(ctx,args)=>{
        const updatedUser = await ctx.db.replace(args.id,{
            user_name: args.user_name,
            image_url: args.image_url,
            user_clerkId: args.user_clerkId,
            email: args.email
        })
        return {data:updatedUser}
    }
})

export const getUser = internalQuery({
    args: {
        user_clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const task = await ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("user_clerkId", args.user_clerkId)).unique();
        
        return {
            data: task
        }
    },
});