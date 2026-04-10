import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Load concepts from directory
  try {
    await storage.loadFromFiles(path.join(__dirname, "..", "concepts"));
  } catch (error) {
    console.error("Failed to load concepts:", error);
  }

  // API routes
  app.get("/api/concepts", async (_req, res) => {
    try {
      const concepts = await storage.listConcepts();
      res.json(concepts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concepts" });
    }
  });

  app.get("/api/concepts/:id", async (req, res) => {
    try {
      const concept = await storage.getConcept(parseInt(req.params.id));
      if (!concept) {
        return res.status(404).json({ message: "Concept not found" });
      }
      res.json(concept);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concept" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}