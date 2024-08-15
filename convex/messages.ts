import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    return messages.map((message) => ({
      ...message,
      body: message.body.replaceAll(":)", "😊"),
    }));
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });
  },
});

const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Fetch a user by their ID.
    const user = ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", email))
      .collect();
    return user;
  },
});

const addOrigin = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    // Add a new origin.
    await ctx.db.insert("origins", { name });
  },
});

const addConsumptionLog = mutation({
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

export const consumptionLog = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Fetch consumption logs for a specific user.
    const consumptionLog = await ctx.db
      .query("consumptionLog")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();
    return consumptionLog;
  },
});
