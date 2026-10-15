import mongoose from 'mongoose';

// Insumos: capacidade em itens/volumes. Pessoas: capacidade em passageiros (demo Opt.en).
export const CATEGORIAS_VEICULO = ['Insumos', 'Pessoas'];

const positivo = (rotulo, min = 0) => ({
    type: Number,
    required: [true, `${rotulo} é obrigatório.`],
    min: [min, `${rotulo} deve ser maior ou igual a ${min}.`],
});

const frotaSchema = new mongoose.Schema({
    marca: { type: String, required: [true, 'A marca é obrigatória.'], trim: true },
    modelo: { type: String, required: [true, 'O modelo é obrigatório.'], trim: true },
    categoria: {
        type: String,
        required: [true, 'A categoria é obrigatória.'],
        enum: { values: CATEGORIAS_VEICULO, message: 'A categoria deve ser: Insumos ou Pessoas.' },
    },
    anoFabricacao: positivo('O ano de fabricação', 1900),
    placa: { type: String, required: [true, 'A placa é obrigatória.'], unique: true, uppercase: true, trim: true },
    capacidadeCarga: positivo('A capacidade de carga', 1),
    capacidadeMaximaTanque: positivo('A capacidade máxima do tanque', 1),
    quilometroPorLitro: positivo('O quilômetro por litro', 0.1),
}, { timestamps: true });

export default mongoose.model('Frota', frotaSchema);
