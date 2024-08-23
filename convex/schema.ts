import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    author: v.string(),
    body: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.string(),
  }).index("byEmail", ["email"]),
  consumptionLog: defineTable({
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
  }).index("byUserId", ["userId"]),
  strains: defineTable({
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
  }),
  origins: defineTable({
    name: v.string(),
  }),
});
