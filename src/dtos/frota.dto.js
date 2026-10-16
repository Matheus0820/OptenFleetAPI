import { co2KgPorKm, arredondar } from '../utils/co2.js';

export class FrotaDto {
    constructor(frota) {
        this.id = frota.id;
        this.marca = frota.marca;
        this.modelo = frota.modelo;
        this.categoria = frota.categoria;
        this.anoFabricacao = frota.anoFabricacao;
        this.placa = frota.placa;
        this.capacidadeCarga = frota.capacidadeCarga;
        this.capacidadeMaximaTanque = frota.capacidadeMaximaTanque;
        this.quilometroPorLitro = frota.quilometroPorLitro;
        this.autonomiaKm = arredondar(frota.capacidadeMaximaTanque * frota.quilometroPorLitro, 1);
        this.emissaoCo2KgPorKm = arredondar(co2KgPorKm(frota.quilometroPorLitro), 3);
    }
}

export default FrotaDto;
