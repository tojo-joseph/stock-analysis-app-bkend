import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3064;

// Middleware
app.use(cors());
app.use(express.json());

// Custom middleware example
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// In-memory store
const store: Record<string, any[]> = {};

// Helper to get resource array
function getResource(name: string): any[] {
  if (!store[name]) store[name] = [];
  return store[name];
}

// CRUD Handlers
app.get("/:resource", (req: Request, res: Response) => {
  const { resource } = req.params;
  const data = getResource(resource);
  res.json(data);
});

app.get("/:resource/:id", (req: any, res: any) => {
  const { resource, id } = req.params;
  const data = getResource(resource);
  const item = data.find((item) => item.id === id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/:resource", (req: Request, res: Response) => {
  const { resource } = req.params;
  const data = getResource(resource);
  const newItem = { id: Date.now().toString(), ...req.body };
  data.push(newItem);
  res.status(201).json(newItem);
});

app.put("/:resource/:id", (req: any, res: any) => {
  const { resource, id } = req.params;
  const data = getResource(resource);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  data[index] = { ...data[index], ...req.body };
  res.json(data[index]);
});

app.delete("/:resource/:id", (req: any, res: any) => {
  const { resource, id } = req.params;
  const data = getResource(resource);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  const removed = data.splice(index, 1);
  res.json(removed[0]);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
