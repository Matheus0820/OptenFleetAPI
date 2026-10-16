import mongoose from 'mongoose';

export const FUNCOES = ['Ajudante', 'Técnico', 'Engenheiro', 'Estagiário'];

const hora = (rotulo, max) => ({
    type: Number,
    required: [true, `${rotulo} é obrigatória.`],
    min: [0, `${rotulo} deve ser maior ou igual a 0.`],
    max: [max, `${rotulo} deve ser menor ou igual a ${max}.`],
});

const colaboradorSchema = new mongoose.Schema({
    // Um usuário (nível Colaborador) tem no máximo um cadastro de colaborador.
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
    funcao: { type: String, required: [true, 'A função é obrigatória.'], enum: FUNCOES },
    horaInicioExpediente: hora('A hora de início do expediente', 23),
    horaFimExpediente: hora('A hora de fim do expediente', 24),
    horasTrabalhoPorDia: hora('A jornada diária', 24),
}, { timestamps: true });

export default mongoose.model('Colaborador', colaboradorSchema);
