// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import fs from "fs/promises";
import path from "path";
var MemStorage = class {
  concepts;
  currentId;
  constructor() {
    this.concepts = /* @__PURE__ */ new Map();
    this.currentId = 1;
  }
  async listConcepts() {
    return Array.from(this.concepts.values());
  }
  async getConcept(id) {
    return this.concepts.get(id);
  }
  async addConcept(concept) {
    const id = this.currentId++;
    const newConcept = { ...concept, id };
    this.concepts.set(id, newConcept);
    return newConcept;
  }
  async loadFromFiles(directory) {
    try {
      const files = await fs.readdir(directory);
      for (const file of files) {
        if (!file.endsWith(".txt")) continue;
        const content = await fs.readFile(path.join(directory, file), "utf-8");
        const parsedContent = this.parseConceptFile(content, file);
        if (parsedContent) {
          await this.addConcept(parsedContent);
        }
      }
    } catch (error) {
      console.error("Error loading concept files:", error);
      throw new Error("Failed to load concept files");
    }
  }
  parseConceptFile(content, fileName) {
    try {
      const lines = content.split("\n");
      const title = path.parse(fileName).name;
      const category = lines[0].replace("Category:", "").trim();
      let descriptionLines = [];
      let currentMethod = "";
      let methodNames = [];
      let snippets = [];
      let currentSnippet = [];
      let inDescription = false;
      let inSnippet = false;
      for (const line of lines.slice(1)) {
        if (line.startsWith("Description:")) {
          inDescription = true;
          inSnippet = false;
          continue;
        }
        if (line.startsWith("Snippet:")) {
          inDescription = false;
          inSnippet = true;
          continue;
        }
        if (inDescription) {
          descriptionLines.push(line.trim());
        } else if (inSnippet) {
          if (line.startsWith("#")) {
            if (currentMethod && currentSnippet.length > 0) {
              methodNames.push(currentMethod);
              snippets.push(currentSnippet.join("\n"));
              currentSnippet = [];
            }
            currentMethod = line.replace("#", "").trim();
          }
          currentSnippet.push(line);
        }
      }
      if (currentMethod && currentSnippet.length > 0) {
        methodNames.push(currentMethod);
        snippets.push(currentSnippet.join("\n"));
      }
      return {
        title,
        category,
        description: descriptionLines.join("\n").trim(),
        snippets,
        methodNames
      };
    } catch (error) {
      console.error("Error parsing concept file:", error);
      return null;
    }
  }
};
var storage = new MemStorage();

// server/routes.ts
import path2 from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
async function registerRoutes(app2) {
  try {
    await storage.loadFromFiles(path2.join(__dirname, "..", "concepts"));
  } catch (error) {
    console.error("Failed to load concepts:", error);
  }
  app2.get("/api/concepts", async (_req, res) => {
    try {
      const concepts = await storage.listConcepts();
      res.json(concepts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concepts" });
    }
  });
  app2.get("/api/concepts/:id", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4, { dirname as dirname3 } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path3, { dirname as dirname2 } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(__dirname2, "client", "src"),
      "@shared": path3.resolve(__dirname2, "shared")
    }
  },
  root: path3.resolve(__dirname2, "client"),
  build: {
    outDir: path3.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(__dirname3, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
