import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('Erro: A variável de ambiente MONGO_URI não foi definida.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Conectado com o MongoDB');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;