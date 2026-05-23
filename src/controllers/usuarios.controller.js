import UsuarioService from '../services/usuarios.service.js';

class UsuarioController {

    static async findAll(req, res, next) {
        try {
            const usuariosDto = await UsuarioService.findAll();
            res.status(200).json(usuariosDto);
        } catch (error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const id = req.params.id;
            const usuarioDto = await UsuarioService.findById(id);
            res.status(200).json(usuarioDto);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const usuarioData = req.body;
            const newUsuarioDto = await UsuarioService.create(usuarioData);
            res.status(201).json(newUsuarioDto);
        } catch (error) {
            next(error);
        }
    }

    static async put(req, res, next) {
        try {
            const usuarioData = req.body;
            const id = req.params.id;

            const putUsuarioDto = await UsuarioService.put(usuarioData, id);
            res.status(200).json(putUsuarioDto);
        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            const usuarioData = req.body;
            const id = req.params.id;

            const patchUsuarioDto = await UsuarioService.patch(usuarioData, id);
            res.status(200).json(patchUsuarioDto);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;

            const deleteUsuarioDto = await UsuarioService.delete(id);
            res.status(200).json(deleteUsuarioDto);
        } catch (error) {
            next(error);
        }
    }
}

export default UsuarioController;