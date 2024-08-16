import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Fetch a user by their email.
    const user = await ctx.db
      .query("users")
      .withIndex("byEmail", (q) => q.eq("email", email))
      .collect();
    return user;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all users.
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    // Remove a user.
    await ctx.db.delete(id);
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, { name, email }) => {
    // Add a new user.
    const insertedUser = await ctx.db.insert("users", {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    return insertedUser;
  },
});
