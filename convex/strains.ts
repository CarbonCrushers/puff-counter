import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent strains.
    const strains = await ctx.db.query("strains").order("desc").take(100);
    return strains;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    effectiveness: v.number(),
    type: v.union(
      v.literal("Indica"),
      v.literal("Sativa"),
      v.literal("Hybrid"),
      v.literal("Unknown"),
    ),
    origin: v.id("origins"),
  },
  handler: async (ctx, { name, imageUrl, effectiveness, type, origin }) => {
    // Add a new strain.
    await ctx.db.insert("strains", {
      name,
      imageUrl,
      effectiveness,
      type,
      origin,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("strains") },
  handler: async (ctx, { id }) => {
    // Remove a strain.
    await ctx.db.delete(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("strains"),
    name: v.string(),
    imageUrl: v.string(),
    effectiveness: v.number(),
    type: v.union(
      v.literal("Indica"),
      v.literal("Sativa"),
      v.literal("Hybrid"),
      v.literal("Unknown"),
    ),
    origin: v.id("origins"),
  },
  handler: async (ctx, { id, name, imageUrl, effectiveness, type, origin }) => {
    // Update a strain.
    await ctx.db.replace(id, {
      name,
      imageUrl,
      effectiveness,
      type,
      origin,
    });
  },
});
