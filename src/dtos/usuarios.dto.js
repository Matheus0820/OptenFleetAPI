export class UsuarioDto {
    constructor(usuario) {
        this.id = usuario.id;
        this.nome = usuario.nome;
        this.email = usuario.email;
        this.nivelAcesso = usuario.nivelAcesso; // Colaborador, Gestor
    }
}

export default UsuarioDto;