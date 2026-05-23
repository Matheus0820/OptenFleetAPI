export class ColaboradorDto {
    constructor(colaborador) {
        this.id = colaborador.id;
        this.nome = colaborador.nome;
        this.funcao = colaborador.funcao;
        this.horaInicioExpediente = colaborador.horaInicioExpediente;
        this.horaFimExpediente = colaborador.horaFimExpediente;
        this.horasTrabalhoPorDia = colaborador.horasTrabalhoPorDia;

    }
}

export default ColaboradorDto;