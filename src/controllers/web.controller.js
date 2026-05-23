import jwt from 'jsonwebtoken';

import ClienteService from '../services/clientes.service.js';
import ColaboradorService from '../services/colaboradores.service.js';
import FrotaService from '../services/frota.service.js';
import UsuarioService from '../services/usuarios.service.js';

class WebController {
    static async listAllPage(req, res, next) {
        try {
            res.render('home', {
                title: 'Páginas da API'
            });

        } catch(error) {
            next(error);
        }
    }
    static async listClientesPage(req, res, next) {
        try {
            const clientesDto = await ClienteService.findAll();

            res.render('clientes', {
                title: 'Clientes Cadastrados',
                clientes: clientesDto
            });

        } catch(error) {
            next(error);
        }
    }

    static async listColaboradoresPage(req, res, next) {
        try {
            const colaboradoresDto = await ColaboradorService.findAll();

            res.render('colaboradores', {
                title: 'Colaboradores Cadastrados',
                colaboradores: colaboradoresDto
            });

        } catch(error) {
            next(error);
        }
    }

    static async listFrotaPage(req, res, next) {
        try {
            const frotaDto = await FrotaService.findAll();

            res.render('frota', {
                title: 'Veículos Cadastrados',
                frota: frotaDto
            })

        } catch(error) {
            next(error);
        }
    }

    static async listUsuariosPage(req, res, next) {
        try {
            const usuariosDto = await UsuarioService.findAll();

            res.render('usuarios', {
                title: 'Usuários Cadastrados',
                usuarios: usuariosDto
            })

        } catch(error) {
            next(error);

        }
    }

    static async loginUser(req, res, next) {
        try {
            res.render('login', {
                title: "Opt.en Fleet - Login"
            });

        } catch(error) {
            next(error);
        }
    }
}

export default WebController;