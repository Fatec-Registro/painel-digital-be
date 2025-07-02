import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Tipos literais para garantir que apenas os valores permitidos sejam usados
type Perfil = 'solicitante' | 'designer' | 'suporte' | 'visualizacao';
type Departamento = 'Atlética' | 'Coordenação' | 'Direção' | 'Administrativo' | 'Secretaria' | 'DTI';

// Interface que representa um documento de usuário (inclui métodos e propriedades do Mongoose)
export interface IUser extends Document {
    nome: string;
    email: string;
    perfil: Perfil;
    departamento: Departamento;
    criadoPor: mongoose.Schema.Types.ObjectId | IUser; // Pode ser um ID ou um documento populado
    dataCriacao: Date;
    ativo: boolean;
    senha: string;
    createdAt: Date;
    updatedAt: Date; 
}

const userSchema: Schema<IUser> = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    ativo: {
        type: Boolean,
        default: true,
    },
    senha: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Hook 'pre-save' para hashear a senha antes de salvar
userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

const User = model<IUser>("User", userSchema);

export default User;