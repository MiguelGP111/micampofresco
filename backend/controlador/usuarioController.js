import Usuario from '../modelo/Usuario.js';
import jwt from 'jsonwebtoken';

class UsuarioController {
    
    // Middleware para validar permisos de administrador
    static validarPermisosAdmin(req, res, next) {
        try {
            // En un sistema real, esto vendría del token JWT o sesión
            // Por ahora, simulamos que el usuario es admin si se pasa el header 'x-admin-token'
            const adminToken = req.headers['x-admin-token'];
            
            if (!adminToken || adminToken !== 'admin-secret-token') {
                return res.status(403).json({
                    error: 'Acceso denegado',
                    mensaje: 'Se requieren permisos de administrador para realizar esta acción'
                });
            }
            
            next();
        } catch (error) {
            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: 'Error al validar permisos'
            });
        }
    }

    // GET /usuarios - Obtener todos los usuarios
    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            
            res.status(200).json({
                exito: true,
                mensaje: 'Usuarios obtenidos correctamente',
                datos: usuarios,
                total: usuarios.length
            });
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }

    // GET /usuarios/:id - Obtener usuario por ID
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido',
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            const usuario = await Usuario.obtenerPorId(parseInt(id));
            
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    mensaje: `No se encontró un usuario con ID ${id}`
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: 'Usuario obtenido correctamente',
                datos: usuario
            });
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }

    // POST /usuarios - Crear nuevo usuario
    static async crear(req, res) {
        try {
            const { nombre, email, password, rol, estado } = req.body;
            
            // Crear instancia del usuario
            const usuario = new Usuario({
                nombre,
                email,
                password, // La contraseña será cifrada en el método crear()
                rol: rol || 'usuario',
                estado: estado || 'activo'
            });

            // Validar datos
            const errores = usuario.validar();
            if (errores.length > 0) {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    mensaje: 'Los siguientes campos tienen errores:',
                    errores: errores
                });
            }

            // Crear usuario en la base de datos (el password se cifra automáticamente)
            const usuarioCreado = await usuario.crear();

            res.status(201).json({
                exito: true,
                mensaje: 'Usuario creado correctamente',
                datos: usuarioCreado
            });
        } catch (error) {
            console.error('Error en crear:', error);
            
            // Manejar error de email duplicado
            if (error.message.includes('email ya está registrado')) {
                return res.status(409).json({
                    error: 'Email duplicado',
                    mensaje: error.message
                });
            }

            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }

    /**
     * POST /login-usuario
     * Endpoint para autenticación de usuarios
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

            // Buscar usuario por email (incluyendo password para verificación)
            const usuario = await Usuario.obtenerPorEmailConPassword(email);

            if (!usuario) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    mensaje: 'Email o contraseña incorrectos'
                });
            }

            // Verificar que el usuario esté activo
            if (usuario.estado !== 'activo') {
                return res.status(403).json({
                    error: 'Usuario inactivo',
                    mensaje: 'Tu cuenta está inactiva. Contacta al administrador'
                });
            }

            // Verificar contraseña
            const passwordValida = await usuario.verificarPassword(password);

            if (!passwordValida) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    mensaje: 'Email o contraseña incorrectos'
                });
            }

            // Generar token JWT
            const JWT_SECRET = process.env.JWT_SECRET || 'micampofresco-secret-key';
            const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    rol: usuario.rol
                },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRATION
                }
            );

            // Calcular fecha de expiración
            const decoded = jwt.decode(token);
            const expiracion = new Date(decoded.exp * 1000).toISOString();

            // Respuesta exitosa con token y datos del usuario
            res.status(200).json({
                exito: true,
                mensaje: 'Login exitoso',
                datos: {
                    token,
                    rol: usuario.rol,
                    nombre: usuario.nombre,
                    email: usuario.email,
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

    // PUT /usuarios/:id - Actualizar usuario
    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, rol, estado } = req.body;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido',
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            // Crear instancia del usuario con los datos actualizados
            const usuario = new Usuario({
                id: parseInt(id),
                nombre,
                email,
                rol,
                estado
            });

            // Validar datos
            const errores = usuario.validar();
            if (errores.length > 0) {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    mensaje: 'Los siguientes campos tienen errores:',
                    errores: errores
                });
            }

            // Actualizar usuario en la base de datos
            const usuarioActualizado = await usuario.actualizar();

            res.status(200).json({
                exito: true,
                mensaje: 'Usuario actualizado correctamente',
                datos: usuarioActualizado
            });
        } catch (error) {
            console.error('Error en actualizar:', error);
            
            // Manejar error de usuario no encontrado
            if (error.message.includes('Usuario no encontrado')) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    mensaje: error.message
                });
            }

            // Manejar error de email duplicado
            if (error.message.includes('email ya está registrado')) {
                return res.status(409).json({
                    error: 'Email duplicado',
                    mensaje: error.message
                });
            }

            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }

    // DELETE /usuarios/:id - Eliminar usuario
    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido',
                    mensaje: 'El ID debe ser un número válido'
                });
            }

            // Eliminar usuario de la base de datos
            const resultado = await Usuario.eliminar(parseInt(id));

            res.status(200).json({
                exito: true,
                mensaje: resultado.mensaje,
                datos: { id: parseInt(id) }
            });
        } catch (error) {
            console.error('Error en eliminar:', error);
            
            // Manejar error de usuario no encontrado
            if (error.message.includes('Usuario no encontrado')) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    mensaje: error.message
                });
            }

            res.status(500).json({
                error: 'Error interno del servidor',
                mensaje: error.message
            });
        }
    }
}

export default UsuarioController;