// CRUD genérico: os repositórios específicos herdam e só acrescentam consultas próprias.
// runValidators garante que PUT/PATCH respeitem as regras do schema (o Mongoose ignora por padrão).
export const crudRepository = (Model) =>
    class {
        static findAll(filtro = {}) { return Model.find(filtro); }
        static findById(id) { return Model.findById(id); }
        static create(data) { return new Model(data).save(); }
        static update(data, id) {
            return Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        }
        static delete(id) { return Model.findByIdAndDelete(id); }
        static count(filtro = {}) { return Model.countDocuments(filtro); }
    };
