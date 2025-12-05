import Admin from '../modelo/Admin.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '../middleware/verificarToken.js';

/**
 * Controlador para operaciones de administradores
 * Maneja el login y autenticación de administradores
 */
class AdminController {
    
    /**
     * POST /login-admin
     * Endpoint para autenticación de administradores
     * Valida credenciales y genera token JWT
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validar que se proporcionaron credenciales
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Datos incompletos',
                    mensaje: 'El email y la contraseña son requeridos'
                });
            }

            // Buscar administrador por email
            const admin = await Admin.obtenerPorEmail(email);

            if (!admin) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    mensaje: 'Email o contraseña incorrectos'
                });
            }

            // Verificar contraseña
            const passwordValida = await admin.verificarPassword(password);

            if (!passwordValida) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    mensaje: 'Email o contraseña incorrectos'
                });
            }


            const token = jwt.sign(
                {
                    id: admin.idusuario,
                    email: admin.email,
                    rol: admin.rol
                },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRATION
                }
            );

            // Calcular fecha de expiración
            const decoded = jwt.decode(token);
            const expiracion = new Date(decoded.exp * 1000).toISOString();

            // Respuesta exitosa con token y datos del administrador
            res.status(200).json({
                exito: true,
                mensaje: 'Login exitoso',
                datos: {
                    token,
                    rol: admin.rol,
                    nombre: admin.nombre,
                    expiracion
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: 'Error al procesar la solicitud de login'
            });
        }
    }

    /**
     * GET /admin/perfil
     * Obtener perfil del administrador autenticado
     * Requiere token JWT válido
     */
    static async obtenerPerfil(req, res) {
        try {
            // El middleware verificarToken ya validó el token y agregó la info a req.usuario
            // El middleware verificarAdmin ya validó que el rol sea 'admin'
            const adminId = req.usuario.id;

            console.log(' obtenerPerfil - Admin ID:', adminId);

            if (!adminId) {
                return res.status(401).json({
                    error: 'No autorizado',
                    mensaje: 'ID de administrador no encontrado en el token'
                });
            }

            const admin = await Admin.obtenerPorId(adminId);

            if (!admin) {
                return res.status(404).json({
                    error: 'Administrador no encontrado',
                    mensaje: 'El administrador no existe'
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: 'Perfil obtenido correctamente',
                datos: admin.toJSON()
            });

        } catch (error) {
            console.error('Error en obtenerPerfil:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }
}

export default AdminController;