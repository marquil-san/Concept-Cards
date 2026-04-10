import { concepts, type Concept, type InsertConcept } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  listConcepts(): Promise<Concept[]>;
  getConcept(id: number): Promise<Concept | undefined>;
  addConcept(concept: InsertConcept): Promise<Concept>;
  loadFromFiles(directory: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private concepts: Map<number, Concept>;
  private currentId: number;

  constructor() {
    this.concepts = new Map();
    this.currentId = 1;
  }

  async listConcepts(): Promise<Concept[]> {
    return Array.from(this.concepts.values());
  }

  async getConcept(id: number): Promise<Concept | undefined> {
    return this.concepts.get(id);
  }

  async addConcept(concept: InsertConcept): Promise<Concept> {
    const id = this.currentId++;
    const newConcept = { ...concept, id };
    this.concepts.set(id, newConcept);
    return newConcept;
  }

  async loadFromFiles(directory: string): Promise<void> {
    try {
      const files = await fs.readdir(directory);

      for (const file of files) {
        if (!file.endsWith('.txt')) continue;

        const content = await fs.readFile(path.join(directory, file), 'utf-8');
        const parsedContent = this.parseConceptFile(content, file);

        if (parsedContent) {
          await this.addConcept(parsedContent);
        }
      }
    } catch (error) {
      console.error('Error loading concept files:', error);
      throw new Error('Failed to load concept files');
    }
  }

  private parseConceptFile(content: string, fileName: string): InsertConcept | null {
    try {
      const lines = content.split('\n');
      const title = path.parse(fileName).name;
      const category = lines[0].replace('Category:', '').trim();

      let descriptionLines: string[] = [];
      let currentMethod = '';
      let methodNames: string[] = [];
      let snippets: string[] = [];
      let currentSnippet: string[] = [];

      let inDescription = false;
      let inSnippet = false;

      for (const line of lines.slice(1)) {
        if (line.startsWith('Description:')) {
          inDescription = true;
          inSnippet = false;
          continue;
        }
        if (line.startsWith('Snippet:')) {
          inDescription = false;
          inSnippet = true;
          continue;
        }

        if (inDescription) {
          descriptionLines.push(line.trim());
        } else if (inSnippet) {
          // Check for method comments
          if (line.startsWith('#')) {
            // If we have a previous method, save it
            if (currentMethod && currentSnippet.length > 0) {
              methodNames.push(currentMethod);
              snippets.push(currentSnippet.join('\n'));
              currentSnippet = [];
            }
            currentMethod = line.replace('#', '').trim();
          }
          currentSnippet.push(line);
        }
      }

      // Don't forget to add the last method
      if (currentMethod && currentSnippet.length > 0) {
        methodNames.push(currentMethod);
        snippets.push(currentSnippet.join('\n'));
      }

      return {
        title,
        category,
        description: descriptionLines.join('\n').trim(),
        snippets,
        methodNames
      };
    } catch (error) {
      console.error('Error parsing concept file:', error);
      return null;
    }
  }
}

export const storage = new MemStorage();