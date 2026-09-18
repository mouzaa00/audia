import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listIdeas = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const ideas = await ctx.db.query("ideas").order("desc").collect();
    if (!userId) {
      return ideas.map((idea) => ({ ...idea, isUpvotedByCurrentUser: false }));
    }

    const mutatedIdeas = [];
    for (const idea of ideas) {
      const upvote = await ctx.db
        .query("upvotes")
        .withIndex("by_idea_user", (q) =>
          q.eq("idea", idea._id).eq("user", userId),
        )
        .unique();

      mutatedIdeas.push({
        ...idea,
        isUpvotedByCurrentUser: upvote ? true : false,
      });
    }

    return mutatedIdeas;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get("users", userId);
  },
});

export const createIdea = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.string(),
    submitter: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ideas", {
      title: args.title,
      description: args.description,
      status: args.status,
      submitter: args.submitter,
      upvotesCount: 0,
      commentsCount: 0,
    });
    return null;
  },
});
