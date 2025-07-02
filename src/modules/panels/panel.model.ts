import mongoose, { Schema, model, Document } from "mongoose";

// Tipo literal para o status, garantindo que apenas valores válidos sejam usados
type StatusPanel = "ativo" | "inativo" | "manutencao";

// Interface que descreve a estrutura de um documento de Painel
export interface IPanel extends Document {
  nome: string;
  localizacao: string;
  descricao?: string; 
  resolucao: string;
  ip_maquina: string;
  status: StatusPanel;
  isSmartTV: boolean;
  temCaboRede: boolean;
  quantasEntradasHDMI: number;
  marcaTV?: string; // Opcional
  anunciosAtivos: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Definição do Schema do Mongoose, agora conectado à nossa interface IPanel
const panelSchema: Schema<IPanel> = new Schema(
  {
    nome: {
      type: String,
      required: [true, "O campo nome é obrigatório."],
    },
    localizacao: {
      type: String,
      required: [true, "O campo localização é obrigatório."],
    },
    descricao: {
      type: String,
    },
    resolucao: {
      type: String,
      default: "1920x1080",
    },
    ip_maquina: {
      type: String,
      required: [true, "O campo ip_maquina é obrigatório."],
      unique: true,
    },
    status: {
      type: String,
      enum: ["ativo", "inativo", "manutencao"],
      default: "ativo",
    },
    isSmartTV: {
      type: Boolean,
      default: false,
    },
    temCaboRede: {
      type: Boolean,
      default: true,
    },
    quantasEntradasHDMI: {
      type: Number,
      default: 1,
    },
    marcaTV: {
      type: String,
    },
    anunciosAtivos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Anuncio", 
        default: [],
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Panel = model<IPanel>("Panel", panelSchema);

export default Panel;