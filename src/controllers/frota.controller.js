import FrotaService from '../services/frota.service.js';

class FrotaController {

    static async findAll(req, res, next) {
        try {
            const frotaDto = await FrotaService.findAll();

            res.status(200).json(frotaDto);

        } catch (error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const id = req.params.id;
            const frotaDto = await FrotaService.findById(id);

            res.status(200).json(frotaDto);

        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const frotaData = req.body;
            const newFrotaDto = await FrotaService.create(frotaData);

            res.status(201).json(newFrotaDto);

        } catch (error) {
            next(error);
        }
    }

    static async put(req, res, next) {
        try {
            const frotaData = req.body;
            const id = req.params.id;

            const putFrotaDto = await FrotaService.put(frotaData, id);

            res.status(200).json(putFrotaDto);

        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            const frotaData = req.body;
            const id = req.params.id;

            const patchFrotaDto = await FrotaService.patch(frotaData, id);

            res.status(200).json(patchFrotaDto);

        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params.id;
            const deleteFrotaDto = await FrotaService.delete(id);

            res.status(200).json(deleteFrotaDto);

        } catch (error) {
            next(error);
        }
    }
}

export default FrotaController;