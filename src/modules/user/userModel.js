import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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

userSchema.pre('save', async function (next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
