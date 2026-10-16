import Colaborador from '../models/colaboradores.model.js';
import { crudRepository } from './crud.repository.js';

const POPULATE = { path: 'user_id', select: 'nome email' };

export default class ColaboradorRepository extends crudRepository(Colaborador) {
    static findAll() { return Colaborador.find().populate(POPULATE); }
    static findById(id) { return Colaborador.findById(id).populate(POPULATE); }
    static findByUserId(userId) { return Colaborador.findOne({ user_id: userId }); }
    static deleteByUserId(userId) { return Colaborador.deleteOne({ user_id: userId }); }
    static async create(data) {
        const novo = await new Colaborador(data).save();
        return novo.populate(POPULATE);
    }
    static update(data, id) {
        return Colaborador.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(POPULATE);
    }
}
