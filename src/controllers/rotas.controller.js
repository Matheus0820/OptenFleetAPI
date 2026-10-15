import RotaService from '../services/rotas.service.js';

class RotaController {
    static async findAll(req, res, next) {
        try { res.status(200).json(await RotaService.findAll()); } catch (e) { next(e); }
    }
    static async findById(req, res, next) {
        try { res.status(200).json(await RotaService.findById(req.params.id)); } catch (e) { next(e); }
    }
    static async gerar(req, res, next) {
        try { res.status(201).json(await RotaService.gerar(req.body, req.usuario)); } catch (e) { next(e); }
    }
    static async delete(req, res, next) {
        try { res.status(200).json(await RotaService.delete(req.params.id)); } catch (e) { next(e); }
    }
}

export default RotaController;
