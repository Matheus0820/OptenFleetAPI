import Frota from '../models/frota.model.js';
import { crudRepository } from './crud.repository.js';

export default class FrotaRepository extends crudRepository(Frota) {}
