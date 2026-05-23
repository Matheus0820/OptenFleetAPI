export class FrotaDto {
    constructor(frota) {
        this.id = frota.id;
        this.marca = frota.marca;
        this.anoFabricacao = frota.anoFabricacao;
        this.placa = frota.placa;
        this.capacidadeMaximaTanque = frota.capacidadeMaximaTanque;
        this.quilometroPorLitro = frota.quilometroPorLitro;
    }
}

export default FrotaDto;