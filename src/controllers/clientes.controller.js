// Importando Service
import ClienteService from '../services/clientes.service.js'

class ClienteController {
    static async findAll(req, res, next) {
        try {
            const clientesDto = await ClienteService.findAll()

            res.status(200).json(clientesDto)

        } catch(error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const id = req.params.id;
            const clienteDto = await ClienteService.findById(id);

            res.status(200).json(clienteDto)

        } catch(error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const clienteData = req.body;
            const newClienteDto = await ClienteService.create(clienteData);

            res.status(201).json(newClienteDto);

        } catch(error) {
            next(error);
        }
    }

    static async put(req, res, next) {
        try {
            const clienteData = req.body;
            const id = req.params.id;

            const putClienteDto = await ClienteService.put(clienteData, id);

            res.status(200).json(putClienteDto);

        } catch(error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            const clienteData = req.body;
            const id = req.params.id;
            const patchClienteDto = await ClienteService.patch(clienteData, id);

            res.status(200).json(patchClienteDto);

        } catch(error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = req.params;
            const deleteClienteDto = await ClienteService.delete(id);

            res.status(200).json(deleteClienteDto);

        } catch(error) {
            next(error);
        }
    }
}

export default ClienteController;