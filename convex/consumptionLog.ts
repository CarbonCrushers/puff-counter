import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    userId: v.id("users"),
    strainId: v.id("strains"),
    quantity: v.number(),
    timestamp: v.string(),
    method: v.union(
      v.literal("Smoke"),
      v.literal("Bong"),
      v.literal("Dag"),
      v.literal("Edible"),
    ),
  },
  handler: async (ctx, { userId, strainId, quantity, timestamp, method }) => {
    // Add a new consumption log.
    await ctx.db.insert("consumptionLog", {
      userId,
      strainId,
      quantity,
      timestamp,
      method,
    });
  },
});

export const list = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    // Fetch consumption logs for a specific user.
    const consumptionLog = await ctx.db
      .query("consumptionLog")
      .withIndex("byUserId", (q) => q.eq("userId", id))
      .collect();
    return consumptionLog;
  },
});

export const remove = mutation({
  args: { id: v.id("consumptionLog") },
  handler: async (ctx, { id }) => {
    // Remove a consumption log.
    await ctx.db.delete(id);
  },
});
