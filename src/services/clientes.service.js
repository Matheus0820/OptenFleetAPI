import ClienteRepository from '../repositories/clientes.repository.js';
import { ClienteDto } from '../dtos/clientes.dto.js';

class ClienteService {
    static async findAll() {
        const clientes = await ClienteRepository.findAll();
        
        const clientesDto = await clientes.map(cliente => new ClienteDto(cliente));
        return clientesDto;
    }

    static async findById(id) {
        // Verificando se cliente existe
        const cliente = await ClienteRepository.findById(id);

        if(!cliente) {
            return new Error('Cliente com ID informado não existe.');
        }

        return new ClienteDto(cliente);
    }

    static async create(clienteData) {
        const newClienteFromDb = await ClienteRepository.create(clienteData)

        return new ClienteDto(newClienteFromDb)
    }

    static async put(clienteData, id) {
        const clienteSalvo = await ClienteRepository.findById(id);

        if(!clienteSalvo) {
            return new Error('Cliente com ID informado não existe.');
        }

        const clienteUpdateDb = await ClienteRepository.update(clienteData, id);
        
        return new ClienteDto(clienteUpdateDb);
    }

    static async patch(clienteData, id) {

        const clienteSalvo = await ClienteRepository.findById(id);

        if(!clienteSalvo) {
            return new Error('Cliente com ID informado não existe.');
        }

        // Fazendo o update
        const clienteUpdateDb = await ClienteRepository.update(clienteData, id);

        return new ClienteDto(clienteUpdateDb);
    }

    static async delete(id) {
        const clienteDelete = await ClienteRepository.findById(id);

        if(!clienteDelete) {
            return new Error('Cliente com ID informado não existe.')
        }

        // Removendo cliente
        await ClienteRepository.delete(id);

        return new ClienteDto(clienteDelete);
    }
}

export default ClienteService;