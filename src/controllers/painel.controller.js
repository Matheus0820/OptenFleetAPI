import PainelService from '../services/painel.service.js';

const rota = (fn) => async (req, res, next) => {
    try { res.status(200).json(await PainelService[fn]()); } catch (e) { next(e); }
};

export default {
    dashboard: rota('dashboard'),
    emissoes: rota('emissoes'),
    equipe: rota('equipe'),
};
