// Extrai latitude/longitude de uma URL do Google Maps.
// Links curtos (maps.app.goo.gl) não carregam coordenadas: exigem latitude/longitude informadas.
const PADROES = [
    /@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
    /[?&](?:q|query|ll|destination|daddr)=(-?\d{1,3}(?:\.\d+)?)(?:,|%2C)(-?\d{1,3}(?:\.\d+)?)/i,
];

export const coordenadaValida = (lat, lng) =>
    Number.isFinite(lat) && Number.isFinite(lng) &&
    Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

export function extrairCoordenadas(url) {
    if (typeof url !== 'string') return null;
    for (const padrao of PADROES) {
        const m = url.match(padrao);
        if (m) {
            const lat = Number(m[1]);
            const lng = Number(m[2]);
            if (coordenadaValida(lat, lng)) return { latitude: lat, longitude: lng };
        }
    }
    return null;
}
