import mongoose from "mongoose";
const { Schema } = mongoose;

const panelSchema = new Schema(
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

const Panel = mongoose.model("Panel", panelSchema);
export default Panel;
