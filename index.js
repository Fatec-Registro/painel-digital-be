import app from "./app.js"
import connectDB from "./src/config/database.js"

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

