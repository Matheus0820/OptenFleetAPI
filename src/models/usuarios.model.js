import mongoose from 'mongoose';

export const NIVEIS_ACESSO = ['Colaborador', 'Gestor'];

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: [true, 'O nome é obrigatório.'], trim: true },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'O email deve ser válido.'],
    },
    nivelAcesso: {
        type: String,
        required: [true, 'O nível de acesso é obrigatório.'],
        enum: { values: NIVEIS_ACESSO, message: 'O nível de acesso deve ser: Colaborador ou Gestor.' },
    },
    // Hash bcrypt; nunca retorna em consultas (select:false).
    senha: { type: String, required: [true, 'A senha é obrigatória.'], select: false },
}, { timestamps: true });

export default mongoose.model('Usuario', usuarioSchema);
