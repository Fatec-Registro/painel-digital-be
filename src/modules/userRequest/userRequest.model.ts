import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Tipos literais para garantir que apenas os valores permitidos sejam usados
type Perfil = 'solicitante' | 'designer' | 'suporte' | 'visualizacao';
type Departamento = 'Atlética' | 'Coordenação' | 'Direção' | 'Administrativo' | 'Secretaria' | 'DTI';

// Interface que representa um documento de usuário (inclui métodos e propriedades do Mongoose)
export interface IUserRequest extends Document {
    nome: string;
    email: string;
    perfil: Perfil;
    departamento: Departamento;
    senhaTemporaria: string;
    criadoPor: mongoose.Types.ObjectId; // Pode ser um ID ou um documento populado
    dataSolicitacao: Date, 
    dataDecisao?: Date,
    analisadoPor?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

const userRequestSchema: Schema<IUserRequest> = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    perfil: {
        type: String,
        enum: ['solicitante', 'designer', 'suporte', 'visualizacao'],
        required: true,
    },
    departamento: {
        type: String,
        enum: ['Atlética', 'Coordenação', 'Direção', 'Administrativo', 'Secretaria', 'DTI'],
        required: true,
    },
    senhaTemporaria: {
        type: String,
        required: true,
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dataSolicitacao: {
        type: Date,
        default: Date.now,
        required: true,
    },
    dataDecisao: {
        type: Date,
        default: Date.now,
        required: false,
    },
    analisadoPor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    status:{
        type: String,
        enum: ['pendente', 'aprovado', 'rejeitado'],
        default: 'pendente',
    }
}, { timestamps: true });

// Hook 'pre-save' para hashear da senha temporaria antes de salvar
userRequestSchema.pre<IUserRequest>('save', async function (next) {
    if (this.isModified('senhaTemporaria')) {
        this.senhaTemporaria = await bcrypt.hash(this.senhaTemporaria, 10);
    }
    next();
});

const UserRequest = model<IUserRequest>("UserRequest", userRequestSchema);

export default UserRequest;