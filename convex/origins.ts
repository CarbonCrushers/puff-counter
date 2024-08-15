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
