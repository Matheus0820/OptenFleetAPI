export const httpError = (statusCode, message) =>
    Object.assign(new Error(message), { statusCode });

export const naoEncontrado = (entidade) =>
    httpError(404, `${entidade} com ID informado não existe.`);
