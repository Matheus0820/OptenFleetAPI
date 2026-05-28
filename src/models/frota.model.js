import mongoose from "mongoose";

const frotaSchema = new mongoose.Schema({
    marcar: {
        type: String,
        required: [true, 'A marca é obrigatória.']
    },
    anoFabricacao: {
        type: Number,
        required: [true, 'O ano de fabricação é obrigatório.'],
        min: [1900, 'O ano de fabricação deve ser maior ou igual a 1900.'],
    },
    placa: {
        type: String,
        required: [true, 'A placa é obrigatória.'],
        unique: true,
    },
    capacidadeMaximaTanque: {
        type: Number,
        required: [true, 'A capacidade máxima do tanque é obrigatória.'],
        min: [0, 'A capacidade máxima do tanque deve ser um número positivo.'],
    },
    quilometroPorLitro: {
        type: Number,
        required: [true, 'O quilômetro por litro é obrigatório.'],
        min: [0, 'O quilômetro por litro deve ser um número positivo.'],
    }

}, {
    timestamps: true
});

export default mongoose.model('Frota', frotaSchema);