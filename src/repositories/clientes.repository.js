import Cliente from '../models/clientes.model.js';
import crypto from 'crypto';

class ClienteRepository {
    static async findAll() {
        const clientes = await Cliente.find();
        return clientes;
    }

    static async findById(id) {
        const cliente = await Cliente.findById(id);
        return cliente;
    }

    static async create(clienteData) {
        const newCliente = new Cliente(clienteData);
        await newCliente.save();
        return newCliente;
    }

    static async update(clienteData, id) {
        const cliente = await Cliente.findByIdAndUpdate(id, clienteData, { new: true });
        return cliente;
    }

    static async delete(id) {
        const cliente = await Cliente.findByIdAndDelete(id);
        return cliente;
    }
}

export default ClienteRepository;