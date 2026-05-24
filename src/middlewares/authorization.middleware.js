export const authorization = (...roles) => {
    return (req, res, next) => {
        const userRole = req.usuario.nivelAcesso;

        const hasPermission = roles.includes(userRole)

        if(!hasPermission) {
            return res.status(403).json({
                message: "Usuário não autorizado!"
            });
        }

        next();
    };
}