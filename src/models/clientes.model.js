import mongoose from 'mongoose';

export const TIPOS_SERVICO = ['Instalação', 'Manutenção'];
// Tempo médio de atendimento por tipo de serviço (minutos), usado quando o gestor não informa.
export const TEMPO_SERVICO_PADRAO_MIN = { 'Instalação': 120, 'Manutenção': 60 };

const clienteSchema = new mongoose.Schema({
    nome: { type: String, required: [true, 'O nome é obrigatório.'], trim: true },
    tipoServico: {
        type: String,
        required: [true, 'O tipo de serviço é obrigatório.'],
        enum: { values: TIPOS_SERVICO, message: 'O tipo de serviço deve ser: Instalação ou Manutenção.' },
    },
    urlMaps: { type: String, required: [true, 'A URL do Google Maps é obrigatória.'], trim: true },
    // Coordenadas extraídas da urlMaps (ou informadas) — necessárias para roteirizar.
    latitude: { type: Number, required: [true, 'A latitude é obrigatória.'], min: -90, max: 90 },
    longitude: { type: Number, required: [true, 'A longitude é obrigatória.'], min: -180, max: 180 },
    // Itens/pessoas que o atendimento consome da capacidade do veículo.
    demanda: { type: Number, default: 1, min: [1, 'A demanda deve ser pelo menos 1.'] },
    tempoServicoMin: { type: Number, min: [5, 'O tempo de serviço deve ser de pelo menos 5 minutos.'] },
    // Prazo: o cliente deve ser atendido até o N-ésimo dia útil do horizonte (vazio = sem prazo).
    prazoDias: { type: Number, min: [1, 'O prazo deve ser de pelo menos 1 dia.'] },
    // Janela de atendimento, em horas do dia (8 = 08:00).
    janelaInicio: { type: Number, default: 8, min: 0, max: 23 },
    janelaFim: { type: Number, default: 17, min: 1, max: 24 },
}, { timestamps: true });

export default mongoose.model('Cliente', clienteSchema);
