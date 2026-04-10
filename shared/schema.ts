import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const concepts = pgTable("concepts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  snippets: text("snippets").array().notNull(),
  methodNames: text("methodNames").array().notNull(),
});

export const insertConceptSchema = createInsertSchema(concepts).pick({
  title: true,
  category: true,
  description: true,
  snippets: true,
  methodNames: true,
});

export type InsertConcept = z.infer<typeof insertConceptSchema>;
export type Concept = typeof concepts.$inferSelect;