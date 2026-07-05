import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Main Router
app.use("/api", routes);

// Base route for health check
app.get("/", (_req, res) => {
    res.send("TechSpec API is running");
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});