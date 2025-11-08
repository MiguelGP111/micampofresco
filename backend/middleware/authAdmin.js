import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar token JWT de administrador
 * Valida el token antes de permitir el acceso a rutas protegidas
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const authAdmin = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: 'Token no proporcionado',
                mensaje: 'Se requiere un token de autenticación. Formato: Bearer <token>'
            });
        }

        // Verificar formato Bearer token
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Formato de token inválido',
                mensaje: 'El token debe tener el formato: Bearer <token>'
            });
        }

        const token = parts[1];

        // Verificar y decodificar token
        const JWT_SECRET = process.env.JWT_SECRET || 'micampofresco-secret-key';
        
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        error: 'Token expirado',
                        mensaje: 'El token de autenticación ha expirado. Por favor, inicia sesión nuevamente'
                    });
                } else if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        error: 'Token inválido',
                        mensaje: 'El token de autenticación no es válido'
                    });
                } else {
                    return res.status(401).json({
                        error: 'Error al verificar token',
                        mensaje: 'Error al procesar el token de autenticación'
                    });
                }
            }

            // Verificar que el rol sea admin
            if (decoded.rol !== 'admin') {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    mensaje: 'Se requieren permisos de administrador para acceder a esta ruta'
                });
            }

            // Agregar información del administrador al request
            req.adminId = decoded.id;
            req.adminEmail = decoded.email;
            req.adminRol = decoded.rol;

            console.log(`✅ Token validado - Admin ID: ${decoded.id}, Email: ${decoded.email}, Rol: ${decoded.rol}`);
            next();
        });

    } catch (error) {
        console.error('Error en authAdmin middleware:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: 'Error al validar autenticación'
        });
    }
};

export default authAdmin;