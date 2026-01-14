import { db } from "./db";
import { products, type Product, type InsertProduct } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getRandomProducts(limit: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getRandomProducts(limit: number): Promise<Product[]> {
    return await db.select().from(products).orderBy(sql`RANDOM()`).limit(limit);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
}

export const storage = new DatabaseStorage();
