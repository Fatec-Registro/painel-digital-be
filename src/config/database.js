import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado com o MongoDB');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
