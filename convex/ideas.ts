import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listIdeas = query({
  args: {},
  handler: async (ctx) => {
    const ideas = await ctx.db
      .query("ideas")
      .withIndex("by_upvotes")
      .order("desc")
      .collect();
    return ideas;
  },
});

export const upvoteIdea = mutation({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    const idea = await ctx.db.get("ideas", args.ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }
    await ctx.db.patch("ideas", args.ideaId, { upvotes: idea.upvotes + 1 });
    return null;
  },
});
