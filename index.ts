import app from "./app.js";
import connectDB from "./src/config/database.js";

// Garantindo que a porta seja um número e tenha um valor padrão
const PORT: number = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em: http://localhost:${PORT}`);
      console.log(`📚 Documentação disponível em: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar no banco, servidor não iniciado", error);
    process.exit(1);
  }
};

startServer();