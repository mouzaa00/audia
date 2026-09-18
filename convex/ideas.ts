import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

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
