import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import './src/middleware/Auth.js';  // importa só pra rodar as declarações globais

// Removendo as extensões .js dos imports
import { swaggerUi, swaggerSpec } from './src/config/swagger.js';
import exampleRoutes from "./src/modules/example/example.routes.js";
import userRoutes from "./src/modules/user/user.routes.js";
import panelRoutes from "./src/modules/panels/panel.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import userRequestRoutes from "./src/modules/userRequest/userRequest.routes.js"

dotenv.config();

// Tipando a variável app com o tipo Express importado
const app: Express = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Rotas
// Rota da documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas dos módulos
app.use("/", exampleRoutes);
app.use("/", userRoutes);
app.use("/", panelRoutes);
app.use("/", authRoutes);
app.use("/", userRequestRoutes);

export default app;