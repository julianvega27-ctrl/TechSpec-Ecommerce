import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { errorHandler } from "./middlewares/error.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger config
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middlewares
app.use(cors());
app.use(express.json());

// Main Router
app.use("/api", routes);

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Base route for health check
app.get("/", (_req, res) => {
    res.send("TechSpec API is running");
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});