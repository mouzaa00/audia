import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  ideas: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(),
    submitter: v.string(),
    votesCount: v.number(),
    commentsCount: v.number(),
  }),
  ideaVotes: defineTable({
    user: v.id("users"),
    idea: v.id("ideas"),
  }).index("by_idea", ["idea"]),
  ideaComments: defineTable({
    user: v.id("users"),
    idea: v.id("ideas"),
    body: v.string(),
  }),
});
