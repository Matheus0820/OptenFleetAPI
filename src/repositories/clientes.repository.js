import db from '../config/database.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
class ClienteRepository {
    static async findAll() {
        db.read();

        const allClientes = db.data.clientes;
        return allClientes;
    }

    static async findById(id) {
        db.read();

        const cliente = await db.data.clientes.find(cliente => cliente.id === id);
        return cliente;
    }

    static async create(clienteData) {
        global.crypto = crypto;
        db.read();

        const newCliente = {
            id: uuidv4(),
            nome: clienteData.nome,
            tipoServico: clienteData.tipoServico,
            urlMaps: clienteData.urlMaps,
        };

        db.data.clientes.push(newCliente);
        await db.write();

        return newCliente;
    }

    static async update(clienteData, id) {
        db.read();

        const cliente = await db.data.clientes.find(cliente => cliente.id === id);

        // Fazendo o update
        cliente.nome = clienteData.nome;
        cliente.tipoServico = clienteData.tipoServico;
        cliente.urlMaps = clienteData.urlMaps;

        // Salvando no banco e retornando cliente salvo
        await db.write();

        return cliente;
    }

    static async delete(id) {
        db.read();

        const indexCliente = await db.data.clientes.findIndex(cliente => cliente.id === id)
        db.data.cliente.splice(indexCliente, 1)
        await db.write();
    }


}

export default ClienteRepository;