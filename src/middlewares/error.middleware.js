const traduzir = (error) => {
    if (error.statusCode) return { status: error.statusCode, message: error.message };
    if (error.name === 'ValidationError') {
        return { status: 400, message: Object.values(error.errors).map((e) => e.message).join(' ') };
    }
    if (error.name === 'CastError') return { status: 400, message: 'ID informado é inválido.' };
    if (error.code === 11000) {
        const campo = Object.keys(error.keyPattern || {})[0] || 'campo';
        return { status: 409, message: `Já existe um registro com este ${campo}.` };
    }
    return null;
};

export const globalErrorHandler = (error, req, res, next) => {
    const conhecido = traduzir(error);
    if (!conhecido) console.error('Erro inesperado:', error);

    const status = conhecido?.status ?? 500;
    res.status(status).json({
        status: 'error',
        statusCode: status,
        message: conhecido?.message ?? 'Ocorreu um erro interno no servidor.',
    });
};
