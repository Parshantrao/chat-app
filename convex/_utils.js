

export const getUserByClerkId = async (
    ctx, clerkId
) => {
    return await ctx.db.query("users").withIndex("by_clerkId",(q)=>q.eq(
        "user_clerkId",clerkId
    )).unique()
}