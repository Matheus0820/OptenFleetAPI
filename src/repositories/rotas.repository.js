import Rota from '../models/rotas.model.js';
import { crudRepository } from './crud.repository.js';

export default class RotaRepository extends crudRepository(Rota) {
    // Listagem leve: sem os dias/paradas.
    static findResumos() { return Rota.find().select('-dias -naoAtendidos').sort({ createdAt: -1 }); }
}
