export class ClienteDto {
    constructor(cliente) {
        this.id = cliente.id;
        this.nome = cliente.nome;
        this.tipoServico = cliente.tipoServico;
        this.urlMaps = cliente.urlMaps;
        this.latitude = cliente.latitude;
        this.longitude = cliente.longitude;
        this.demanda = cliente.demanda;
        this.tempoServicoMin = cliente.tempoServicoMin;
        this.prazoDias = cliente.prazoDias ?? null;
        this.janelaInicio = cliente.janelaInicio;
        this.janelaFim = cliente.janelaFim;
    }
}

export default ClienteDto;
