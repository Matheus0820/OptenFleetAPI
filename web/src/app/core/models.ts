export type NivelAcesso = 'Colaborador' | 'Gestor';
export type Horizonte = 'Diário' | 'Semanal' | 'Mensal';

export interface Usuario { id: string; nome: string; email: string; nivelAcesso: NivelAcesso; }

export interface Veiculo {
  id: string; marca: string; modelo: string; categoria: 'Insumos' | 'Pessoas'; anoFabricacao: number;
  placa: string; capacidadeCarga: number; capacidadeMaximaTanque: number; quilometroPorLitro: number;
  autonomiaKm: number; emissaoCo2KgPorKm: number;
}

export interface Colaborador {
  id: string; user_id: string; nome: string | null; email: string | null; funcao: string;
  horaInicioExpediente: number; horaFimExpediente: number; horasTrabalhoPorDia: number; cargaSemanalHoras: number;
}

export interface Cliente {
  id: string; nome: string; tipoServico: 'Instalação' | 'Manutenção'; urlMaps: string;
  latitude: number; longitude: number; demanda: number; tempoServicoMin: number; prazoDias?: number | null; janelaInicio: number; janelaFim: number;
}

export interface Parada { cliente: string; nome: string; tipoServico: string; chegada: string; saida: string; urlMaps: string; }
export interface DiaRota {
  dia: number; data: string; placa: string; modelo: string; distanciaKm: number; tempoMin: number;
  litros: number; co2Kg: number; mapsUrl: string; paradas: Parada[];
}
export interface ResumoRota {
  destinos: number; atendidos: number; naoAtendidos: number; veiculosUsados: number;
  distanciaKm: number; tempoMin: number; litros: number; co2Kg: number; reducaoCo2Kg: number;
}
export interface Rota {
  id: string; nome: string; horizonte: Horizonte; dataInicio: string; fonteMatriz: 'osrm' | 'haversine';
  resumo: ResumoRota; dias?: DiaRota[]; naoAtendidos?: { cliente: string; nome: string; motivo: string }[];
}

export interface Dashboard {
  rotas: number; colaboradores: number; frota: number; clientes: number;
  reducaoMensalCo2Kg: number; emissaoMensalCo2Kg: number;
}
export interface RelEmissoes {
  meses: { periodo: string; rotas: number; distanciaKm: number; litros: number; co2Kg: number; reducaoCo2Kg: number }[];
  totais: { co2Kg: number; reducaoCo2Kg: number; distanciaKm: number };
}
export interface RelEquipe {
  colaboradores: number; horasSemanaisContratadas: number; horasEmRotaNoMes: number;
  porFuncao: Record<string, { colaboradores: number; horasSemanais: number }>;
  detalhe: { nome: string; funcao: string; jornada: string; cargaSemanalHoras: number }[];
}
