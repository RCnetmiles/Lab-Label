import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getRandomProducts(6); // Fetch 6 for a full game round
    res.json(products);
  });

  app.post(api.products.verify.path, async (req, res) => {
    try {
      const input = api.products.verify.input.parse(req.body);
      const product = await storage.getProduct(input.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Logic to verify answer
      const isContainerCorrect = product.correctContainer === input.selectedContainer;
      
      // Sort arrays to compare
      const sortedCorrect = [...product.correctPictograms].sort();
      const sortedSelected = [...input.selectedPictograms].sort();
      
      const arePictogramsCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedSelected);
      
      const correct = isContainerCorrect && arePictogramsCorrect;
      
      let message = "Perfect labeling.";
      let scoreDelta = 100;

      if (!correct) {
        scoreDelta = -50;
        const errors = [];
        if (!isContainerCorrect) errors.push("Wrong container type.");
        if (!arePictogramsCorrect) errors.push("Incorrect hazard symbols.");
        message = `Citation Issued: ${errors.join(" ")}`;
      }

      res.json({
        correct,
        scoreDelta,
        message,
        correctContainer: product.correctContainer,
        correctPictograms: product.correctPictograms
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getRandomProducts(1);
  if (existing.length === 0) {
    const seedProducts = [
      {
        name: "Ethanol 99%",
        description: "REQ-001: Clear, colorless liquid. Highly volatile. Flash point 13°C. Causes severe eye irritation. Handle with care away from heat sources.",
        correctContainer: "glass", // Or compatible plastic, but let's say Glass for lab standard here for simplicity
        correctPictograms: ["flammable", "irritant"]
      },
      {
        name: "Sulfuric Acid",
        description: "REQ-002: Oily liquid. Extremely corrosive to skin and metals. Reacts violently with water. Use high-density polyethylene or glass.",
        correctContainer: "glass",
        correctPictograms: ["corrosive"]
      },
      {
        name: "Sodium Hydroxide Pellets",
        description: "REQ-003: White solid pellets. Deliquescent. Causes severe skin burns and eye damage. Hygroscopic.",
        correctContainer: "plastic", // Plastic is better for solids/bases that might etch glass over long time or for safety handling
        correctPictograms: ["corrosive"]
      },
      {
        name: "Benzene",
        description: "REQ-004: Colorless liquid with sweet odor. Carcinogenic and mutagenic. Highly flammable. Toxic to aquatic life.",
        correctContainer: "glass",
        correctPictograms: ["flammable", "health_hazard", "toxic"]
      },
      {
        name: "Distilled Water",
        description: "REQ-005: Purified water. Non-hazardous. Used for solvents and cleaning.",
        correctContainer: "plastic",
        correctPictograms: [] // None
      },
      {
        name: "Acetone",
        description: "REQ-006: Solvent. Highly flammable liquid and vapor. Causes serious eye irritation. May cause drowsiness or dizziness.",
        correctContainer: "glass", // or metal/special plastic
        correctPictograms: ["flammable", "irritant"]
      },
      {
        name: "Hydrochloric Acid",
        description: "REQ-007: Aqueous solution of hydrogen chloride. Corrosive to respiratory tract. Causes severe burns.",
        correctContainer: "glass",
        correctPictograms: ["corrosive", "irritant"]
      }
    ];

    for (const p of seedProducts) {
      await storage.createProduct(p);
    }
  }
}
