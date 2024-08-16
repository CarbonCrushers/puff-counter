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
      v.literal("Dab"),
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
  args: {},
  handler: async (ctx) => {
    // Fetch consumption logs for a specific user.
    const consumptionLog = await ctx.db.query("consumptionLog").collect();
    return consumptionLog;
  },
});

export const getUserConsumptionLogs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Fetch all consumption logs for the specified user.
    const consumptionLogs = await ctx.db
      .query("consumptionLog")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    return consumptionLogs;
  },
});

export const remove = mutation({
  args: { id: v.id("consumptionLog") },
  handler: async (ctx, { id }) => {
    // Remove a consumption log.
    await ctx.db.delete(id);
  },
});

export const countTodayConsumptionLogs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Fetch all consumption logs for the specified user
    const consumptionLogs = await ctx.db
      .query("consumptionLog")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    // Filter logs for today's date using _creationTime and sum the quantities
    const todayLogsCount = consumptionLogs
      .filter((log) =>
        new Date(log._creationTime).toISOString().startsWith(today),
      )
      .reduce((total, log) => total + log.quantity, 0);

    return todayLogsCount;
  },
});

export const getConsumptionLogsByDay = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Fetch all consumption logs for the specified user
    const consumptionLogs = await ctx.db
      .query("consumptionLog")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    // Initialize an empty object to hold the grouped logs
    const groupedByDay: Record<string, any[]> = {};

    // Iterate over each log and group them by day
    for (const log of consumptionLogs) {
      const day = new Date(log._creationTime).toISOString().split("T")[0];

      // If the day doesn't exist in the object, create an empty array for that day
      if (!groupedByDay[day]) {
        groupedByDay[day] = [];
      }

      // Push the log into the appropriate day's array
      groupedByDay[day].push(log);
    }

    return groupedByDay;
  },
});
