import mongoose from 'mongoose';

// nome, tipoServico, urlMaps

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.']
    },
    tipoServico: {
        type: String,
        required: [true, 'O tipo de serviço é obrigatório.']
    },
    urlMaps: {
        type: String,
        required: [true, 'A URL do Google Maps é obrigatória.']
    }
}, {
    timestamps: true
});

export default mongoose.model('Cliente', clienteSchema);