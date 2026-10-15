import mongoose from 'mongoose';

export const HORIZONTES = ['Diário', 'Semanal', 'Mensal'];

const paradaSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
    nome: String,
    tipoServico: String,
    latitude: Number,
    longitude: Number,
    urlMaps: String,
    chegada: String, // HH:MM
    saida: String,
}, { _id: false });

// Um veículo em um dia de execução.
const diaSchema = new mongoose.Schema({
    dia: Number, // 1..N dentro do horizonte
    data: Date,
    veiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Frota' },
    placa: String,
    modelo: String,
    distanciaKm: Number,
    tempoMin: Number,
    litros: Number,
    co2Kg: Number,
    mapsUrl: String,
    paradas: [paradaSchema],
}, { _id: false });

const rotaSchema = new mongoose.Schema({
    nome: { type: String, required: [true, 'O nome da rota é obrigatório.'], trim: true },
    horizonte: { type: String, required: true, enum: HORIZONTES },
    dataInicio: { type: Date, required: true },
    deposito: { nome: String, latitude: Number, longitude: Number },
    fonteMatriz: { type: String, enum: ['osrm', 'haversine'] },
    criadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    resumo: {
        destinos: Number,
        atendidos: Number,
        naoAtendidos: Number,
        veiculosUsados: Number,
        distanciaKm: Number,
        tempoMin: Number,
        litros: Number,
        co2Kg: Number,
        reducaoCo2Kg: Number, // vs. atender cada cliente em viagem individual ida-e-volta
    },
    dias: [diaSchema],
    naoAtendidos: [{ _id: false, cliente: mongoose.Schema.Types.ObjectId, nome: String, motivo: String }],
}, { timestamps: true });

export default mongoose.model('Rota', rotaSchema);
