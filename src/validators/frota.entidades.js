import { campo } from './helpers.js';

const regras = (patch) => [
    campo(patch, 'marca', 'A marca do veículo').trim().isLength({ min: 2 }).withMessage('A marca deve ter no mínimo 2 caracteres'),
    campo(patch, 'modelo', 'O modelo do veículo').trim().isLength({ min: 1 }).withMessage('Informe o modelo'),
    campo(patch, 'categoria', 'A categoria').isIn(['Insumos', 'Pessoas']).withMessage('A categoria deve ser: Insumos ou Pessoas'),
    campo(patch, 'anoFabricacao', 'O ano de fabricação')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Informe um ano de fabricação válido').toInt(),
    campo(patch, 'placa', 'A placa').trim().toUpperCase()
        .matches(/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/).withMessage('Placa inválida (use ABC1D23 ou ABC-1234)'),
    campo(patch, 'capacidadeCarga', 'A capacidade de carga').isInt({ min: 1 }).withMessage('A capacidade de carga deve ser um inteiro maior que 0').toInt(),
    campo(patch, 'capacidadeMaximaTanque', 'A capacidade do tanque').isFloat({ min: 1 }).withMessage('A capacidade do tanque deve ser maior que 0').toFloat(),
    campo(patch, 'quilometroPorLitro', 'O consumo (km por litro)').isFloat({ min: 0.1 }).withMessage('O consumo deve ser maior que 0').toFloat(),
];

export const regrasValidacaoFrota = regras(false);
export const regrasValidacaoFrotaPatch = regras(true);
export default regrasValidacaoFrota;
