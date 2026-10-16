export class ColaboradorDto {
    constructor(colaborador) {
        const usuario = colaborador.user_id?.nome ? colaborador.user_id : null; // populado
        this.id = colaborador.id;
        this.user_id = String(usuario?._id ?? colaborador.user_id);
        this.nome = usuario?.nome ?? null;
        this.email = usuario?.email ?? null;
        this.funcao = colaborador.funcao;
        this.horaInicioExpediente = colaborador.horaInicioExpediente;
        this.horaFimExpediente = colaborador.horaFimExpediente;
        this.horasTrabalhoPorDia = colaborador.horasTrabalhoPorDia;
        this.cargaSemanalHoras = colaborador.horasTrabalhoPorDia * 5; // 5 dias úteis
    }
}

export default ColaboradorDto;
