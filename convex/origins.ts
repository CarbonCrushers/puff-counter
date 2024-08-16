import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all origins.
    const origins = await ctx.db.query("origins").collect();
    return origins;
  },
});

export const add = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    // Add a new origin.
    await ctx.db.insert("origins", { name });
  },
});

export const update = mutation({
  args: { id: v.id("origins"), name: v.string() },
  handler: async (ctx, { id, name }) => {
    // Update an origin.
    await ctx.db.replace(id, { name });
  },
});

export const remove = mutation({
  args: { id: v.id("origins") },
  handler: async (ctx, { id }) => {
    // Remove an origin.
    await ctx.db.delete(id);
  },
});
