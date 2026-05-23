import ColaboradorService from '../services/colaboradores.service.js';

class ColaboradorController {
    static async findAll(req, res, next) {
        try {
            const colaboradoresDto = await ColaboradorService.findAll();

            res.status(200).json(colaboradoresDto);
        } catch (error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const id = req.params.id;
            const colaboradorDto = await ColaboradorService.findById(id);

            res.status(200).json(colaboradorDto);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const colaboradorData = req.body;
            const newColaboradorDto = await ColaboradorService.create(colaboradorData);

            res.status(201).json(newColaboradorDto);
        } catch (error) {
            next(error);
        }
    }

    static async put(req, res, next) {
        try {
            const colaboradorData = req.body;
            const id = req.params.id;

            const putColaboradorDto = await ColaboradorService.put(colaboradorData, id);

            res.status(200).json(putColaboradorDto);
        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            const colaboradorData = req.body;
            const id = req.params.id;

            const patchColaboradorDto = await ColaboradorService.patch(colaboradorData, id);

            res.status(200).json(patchColaboradorDto);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const deleteColaboradorDto = await ColaboradorService.delete(id);

            res.status(200).json(deleteColaboradorDto);
        } catch (error) {
            next(error);
        }
    }
}

export default ColaboradorController;