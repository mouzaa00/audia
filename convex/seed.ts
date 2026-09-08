import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const dummyIdeas = [
  {
    title: "Dark mode toggle",
    description:
      "Add a manual dark mode toggle button in the header so users can switch themes without relying on system preferences.",
    status: "open",
    submitter: "Alice Chen",
    upvotes: 42,
  },
  {
    title: "Keyboard shortcuts",
    description:
      "Support common keyboard shortcuts like Cmd+K for search, Cmd+/ for help, and arrow keys for navigation between ideas.",
    status: "planned",
    submitter: "Bob Martinez",
    upvotes: 38,
  },
  {
    title: "Email notifications for status changes",
    description:
      "Send an email notification to the submitter when their idea's status changes from open to planned or in progress.",
    status: "open",
    submitter: "Charlie Park",
    upvotes: 27,
  },
  {
    title: "Drag and drop reordering",
    description:
      "Allow administrators to manually reorder ideas via drag and drop, independent of upvote count.",
    status: "in_progress",
    submitter: "Diana Reeves",
    upvotes: 19,
  },
  {
    title: "Markdown support in descriptions",
    description:
      "Parse markdown in idea descriptions so submitters can add formatting, code blocks, and links to their proposals.",
    status: "open",
    submitter: "Ethan Brooks",
    upvotes: 15,
  },
  {
    title: "Duplicate idea detection",
    description:
      "When a user submits a new idea, suggest similar existing ideas to reduce duplicates and consolidate votes.",
    status: "open",
    submitter: "Fiona Gallagher",
    upvotes: 11,
  },
];

export const seedIdeas = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("ideas").collect();
    for (const doc of existing) {
      await ctx.db.delete("ideas", doc._id);
    }

    for (const idea of dummyIdeas) {
      await ctx.db.insert("ideas", idea);
    }

    return dummyIdeas.length;
  },
});
