import { query } from "./_generated/server";

export const listIdeas = query({
  args: {},
  handler: async (ctx) => {
    const ideas = await ctx.db.query("ideas").order("desc").collect();
    return ideas;
  },
});
