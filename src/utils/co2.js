// Fator de emissão adotado no demo Opt.en: 2,3 kg de CO₂ por litro de combustível.
export const KG_CO2_POR_LITRO = 2.3;

export const litrosConsumidos = (km, kmPorLitro) => (kmPorLitro > 0 ? km / kmPorLitro : 0);

export const co2Kg = (km, kmPorLitro) => litrosConsumidos(km, kmPorLitro) * KG_CO2_POR_LITRO;

// kg de CO₂ emitidos por km rodado (mesma conta do demo: 2,3 / consumo).
export const co2KgPorKm = (kmPorLitro) => (kmPorLitro > 0 ? KG_CO2_POR_LITRO / kmPorLitro : 0);

export const arredondar = (n, casas = 2) => Number(Number(n).toFixed(casas));
