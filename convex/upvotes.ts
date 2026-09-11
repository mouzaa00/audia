import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const upvoteToggle = mutation({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const existing = await ctx.db
      .query("upvotes")
      .withIndex("by_idea_user", (q) =>
        q.eq("idea", args.ideaId).eq("user", userId),
      )
      .unique();

    // If a user already upvoted an idea, delete it
    if (existing) {
      await ctx.db.delete("upvotes", existing._id);
      return existing._id;
    }

    const voteId = await ctx.db.insert("upvotes", {
      user: userId,
      idea: args.ideaId,
    });
    return voteId;
  },
});
