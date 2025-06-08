import express from "express";
import dotenv from "dotenv";

import { swaggerUi, swaggerSpec } from './src/config/swagger.js';
import exampleRoutes from "./src/modules/example/exampleRoutes.js";
import userRoutes from "./src/modules/user/userRoutes.js";
import authRoutes from "./src/modules/auth/authRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Rotas
// Rota da documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", exampleRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);

export default app;