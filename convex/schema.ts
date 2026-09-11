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
    upvotesCount: v.number(),
    commentsCount: v.number(),
  }),
  upvotes: defineTable({
    user: v.id("users"),
    idea: v.id("ideas"),
  }).index("by_idea_user", ["idea", "user"]),
  comments: defineTable({
    user: v.id("users"),
    idea: v.id("ideas"),
    body: v.string(),
  }),
});
