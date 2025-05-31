import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js"
import exampleRoutes from "./src/modules/example/exampleRoutes.js";

const app = express();
dotenv.config();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Rotas
app.use("/", exampleRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
  try{
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Erro ao conectar no banco, servidor não iniciado", error);
    process.exit(1);
  }
};

startServer();

