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
    upvotes: v.number(),
  }).index("by_upvotes", ["upvotes"]),
});
