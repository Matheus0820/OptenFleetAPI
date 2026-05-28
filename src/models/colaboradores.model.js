import mongoose from 'mongoose';

// user_id, funcao, horaInicioExpediente, horaFimExpediente, horaTrabalhoPorDia

const colaboradorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    funcao: {
        type: String,
        required: [true, 'A função é obrigatória.'],
    },
    horaInicioExpediente: {
        type: Number,
        required: [true, 'A hora de início do expediente é obrigatória.'],
        min: [0, 'A hora de início do expediente deve ser um número positivo.'],
        max: [24, 'A hora de início do expediente deve ser menor ou igual a 24.'],
    },
    horaFimExpediente: {
        type: Number,
        required: [true, 'A hora de fim do expediente é obrigatória.'],
        min: [0, 'A hora de fim do expediente deve ser um número positivo.'],
        max: [24, 'A hora de fim do expediente deve ser menor ou igual a 24.'],
    },
    horaTrabalhoPorDia: {
        type: Number,
        required: [true, 'A hora de trabalho por dia é obrigatória.'],
        min: [0, 'A hora de trabalho por dia deve ser um número positivo.'],
        max: [24, 'A hora de trabalho por dia deve ser menor ou igual a 24.'],
    }
}, {
    timestamps: true
});

export default mongoose.model('Colaborador', colaboradorSchema);