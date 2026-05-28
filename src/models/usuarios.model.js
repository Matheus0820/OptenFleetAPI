import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.']
    },

    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'O email deve ser válido.']
    },

    nivelAcesso: {
        type: String,
        required: [true, 'O nível de acesso é obrigatório.'],
     },

    senha: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.']
    }
}, {
    timestamps: true
});

export default mongoose.model('Usuario', usuarioSchema);