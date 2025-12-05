export const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado',
            mensaje: 'Ruta protegida, solo admin'
        });
    }
    next();
};
