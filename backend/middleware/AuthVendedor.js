export const verificarVendedor = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            error: "No autorizado",
            mensaje: "Debe autenticarse primero"
        });
    }

    if (req.usuario.rol !== "vendedor") {
        return res.status(403).json({
            error: "Acceso denegado",
            mensaje: "Ruta protegida, acceso solo a vendedores"
        });
    }
    next();
};