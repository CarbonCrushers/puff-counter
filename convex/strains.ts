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

export const addStrain = mutation({
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
