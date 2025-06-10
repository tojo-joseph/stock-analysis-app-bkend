"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3064;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Custom middleware example
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});
// In-memory store
const store = {};
// Helper to get resource array
function getResource(name) {
    if (!store[name])
        store[name] = [];
    return store[name];
}
// CRUD Handlers
app.get("/:resource", (req, res) => {
    const { resource } = req.params;
    const data = getResource(resource);
    res.json(data);
});
app.get("/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const data = getResource(resource);
    const item = data.find((item) => item.id === id);
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
});
app.post("/:resource", (req, res) => {
    const { resource } = req.params;
    const data = getResource(resource);
    const newItem = { id: Date.now().toString(), ...req.body };
    data.push(newItem);
    res.status(201).json(newItem);
});
app.put("/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const data = getResource(resource);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1)
        return res.status(404).json({ error: "Not found" });
    data[index] = { ...data[index], ...req.body };
    res.json(data[index]);
});
app.delete("/:resource/:id", (req, res) => {
    const { resource, id } = req.params;
    const data = getResource(resource);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1)
        return res.status(404).json({ error: "Not found" });
    const removed = data.splice(index, 1);
    res.json(removed[0]);
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
