import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(), // The text on the "form"
  correctContainer: text("correct_container").notNull(), // 'glass' | 'plastic'
  correctPictograms: text("correct_pictograms").array().notNull(), // Array of GHS ids e.g. ['flammable', 'toxic']
});

// === SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ id: true });

// === TYPES ===
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// API Types
export type VerifyAnswerRequest = {
  productId: number;
  selectedContainer: string;
  selectedPictograms: string[];
};

export type VerifyAnswerResponse = {
  correct: boolean;
  scoreDelta: number;
  message: string;
  correctContainer: string;
  correctPictograms: string[];
};

export type GameState = {
  currentProductIndex: number;
  score: number;
  history: {
    productName: string;
    correct: boolean;
  }[];
};
