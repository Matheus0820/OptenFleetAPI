import Cliente from '../models/clientes.model.js';
import { crudRepository } from './crud.repository.js';

export default class ClienteRepository extends crudRepository(Cliente) {}
