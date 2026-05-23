export class ClienteDto {
    constructor(cliente) {
        this.id = cliente.id
        this.nome = cliente.nome
        this.tipoServico = cliente.tipoServico
        this.urlMaps = cliente.urlMaps
    }
}

export default ClienteDto;