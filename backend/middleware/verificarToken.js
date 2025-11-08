import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware general para verificar el token JWT
 * Valida el token y agrega la información del usuario a req.usuario
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const verificarToken = (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Token no proporcionado', 
                mensaje: 'Debe iniciar sesión para acceder a esta ruta' 
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'micampofresco-secret-key';
        
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ 
                        error: 'Token inválido o expirado', 
                        mensaje: 'Por favor inicie sesión nuevamente' 
                    });
                } else {
                    return res.status(403).json({ 
                        error: 'Token inválido o expirado', 
                        mensaje: 'Por favor inicie sesión nuevamente' 
                    });
                }
            }

            // Agregar información del usuario al request
            req.usuario = decoded;
            next();
        });
    } catch (error) {
        console.error('Error en verificarToken middleware:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: 'Error al validar autenticación'
        });
    }
};

/**
 * Middleware específico para verificar si el rol es admin
 * Debe usarse después de verificarToken
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const verificarAdmin = (req, res, next) => {
    try {
        if (!req.usuario) {
            return res.status(401).json({
                error: 'No autorizado',
                mensaje: 'Debe usar verificarToken antes de verificarAdmin'
            });
        }

        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({
                error: 'Acceso denegado',
                mensaje: 'Solo los administradores pueden acceder a esta ruta'
            });
        }

        next();
    } catch (error) {
        console.error('Error en verificarAdmin middleware:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: 'Error al validar permisos'
        });
    }
};
