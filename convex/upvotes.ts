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

    const idea = await ctx.db
      .query("ideas")
      .withIndex("by_id", (q) => q.eq("_id", args.ideaId))
      .unique();
    if (!idea) {
      throw new ConvexError("Idea not found");
    }

    const existing = await ctx.db
      .query("upvotes")
      .withIndex("by_idea_user", (q) =>
        q.eq("idea", args.ideaId).eq("user", userId),
      )
      .unique();

    // If a user already upvoted an idea, delete it
    if (existing) {
      // Decrease the upvote count of that specific idea by 1
      await ctx.db.patch("ideas", args.ideaId, {
        upvotesCount: idea.upvotesCount - 1,
      });
      await ctx.db.delete("upvotes", existing._id);
      return existing._id;
    }

    // Increase the upvote count of that specific idea by 1
    await ctx.db.patch("ideas", args.ideaId, {
      upvotesCount: idea.upvotesCount + 1,
    });
    const voteId = await ctx.db.insert("upvotes", {
      user: userId,
      idea: args.ideaId,
    });
    return voteId;
  },
});
