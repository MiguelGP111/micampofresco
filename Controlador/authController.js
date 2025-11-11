import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Constantes
const ROLES_VALIDOS = ['usuario', 'vendedor', 'administrador'];
const ROL_DEFAULT = 'usuario';
const TOKEN_EXPIRY = '1h';
const RECOVERY_CODE_EXPIRY_HOURS = 1;

// Almacenamiento temporal para códigos de recuperación (en producción, usar tabla en DB)
const recoveryCodes = new Map();

/**
 * Valida formato de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email.trim());
};

/**
 * Valida y normaliza rol
 */
const isValidRole = (role) => {
  if (!role) return ROL_DEFAULT;
  const roleLower = role.toLowerCase().trim();
  return ROLES_VALIDOS.includes(roleLower) ? roleLower : ROL_DEFAULT;
};

/**
 * Genera token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

/**
 * Genera código de recuperación
 */
const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Registro de usuario
 * POST /auth/registro
 */
const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, correo, celular, direccion, password, rol } = req.body;

    // Validaciones
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    if (!apellido || !apellido.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El apellido es requerido'
      });
    }

    if (!correo || !isValidEmail(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico inválido'
      });
    }

    if (!celular || !celular.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El celular es requerido'
      });
    }

    if (!direccion || !direccion.trim()) {
      return res.status(400).json({
        success: false,
        message: 'La dirección es requerida'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const roleFinal = isValidRole(rol);

    // Verificar si el correo ya existe
    const emailCheck = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo.trim().toLowerCase()]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Verificar si el celular ya existe
    const celularCheck = await pool.query(
      'SELECT id FROM usuarios WHERE celular = $1',
      [celular.trim()]
    );

    if (celularCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El número de celular ya está registrado'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, correo, celular, direccion, password, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, apellido, correo, celular, direccion, rol, creado_en`,
      [
        nombre.trim(),
        apellido.trim(),
        correo.trim().toLowerCase(),
        celular.trim(),
        direccion.trim(),
        passwordHash,
        roleFinal
      ]
    );

    const nuevoUsuario = result.rows[0];

    // Generar token JWT
    const token = generateToken(nuevoUsuario);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      data: nuevoUsuario
    });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al registrar usuario'
    });
  }
};

/**
 * Recuperación de contraseña
 * POST /auth/recuperar
 */
const recoverPassword = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar correo
    if (!correo || !isValidEmail(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico inválido'
      });
    }

    // Buscar usuario en la base de datos
    const userResult = await pool.query(
      'SELECT id, correo, nombre FROM usuarios WHERE correo = $1',
      [correo.trim().toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Por seguridad, no revelamos si el email existe
      return res.json({
        success: true,
        message: 'Si el correo existe, se procesará la recuperación'
      });
    }

    const usuario = userResult.rows[0];

    // Si se envía password, actualizar directamente
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Encriptar contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Actualizar contraseña en la base de datos
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE id = $2',
        [passwordHash, usuario.id]
      );

      return res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    }

    // Si no se envía password, generar código de recuperación
    const codigoRecuperacion = generateRecoveryCode();
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + RECOVERY_CODE_EXPIRY_HOURS);

    // Guardar código en memoria (en producción, usar tabla en DB)
    recoveryCodes.set(correo.trim().toLowerCase(), {
      codigo: codigoRecuperacion,
      usuarioId: usuario.id,
      fechaExpiracion: fechaExpiracion.toISOString(),
      usado: false
    });

    // Simular envío de correo (en producción, enviar email real)
    console.log(`=== CÓDIGO DE RECUPERACIÓN ===`);
    console.log(`Para: ${usuario.correo}`);
    console.log(`Código: ${codigoRecuperacion}`);
    console.log(`Expira: ${fechaExpiracion.toISOString()}`);
    console.log(`================================`);

    // Respuesta (en producción, no devolver el código)
    res.json({
      success: true,
      message: 'Código de recuperación generado',
      codigoSimulado: codigoRecuperacion // Solo para desarrollo
    });

  } catch (error) {
    console.error('Error en recoverPassword:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al procesar recuperación'
    });
  }
};

/**
 * Restablecer contraseña con código
 * POST /auth/restablecer
 */
const restablecerPassword = async (req, res) => {
  try {
    const { correo, codigo, password } = req.body;

    // Validaciones
    if (!correo || !isValidEmail(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico inválido'
      });
    }

    if (!codigo) {
      return res.status(400).json({
        success: false,
        message: 'El código de recuperación es requerido'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar código de recuperación
    const recoveryData = recoveryCodes.get(correo.trim().toLowerCase());

    if (!recoveryData) {
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación inválido'
      });
    }

    // Verificar código
    if (recoveryData.codigo !== codigo.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación inválido'
      });
    }

    // Verificar si ya fue usado
    if (recoveryData.usado) {
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación ya utilizado'
      });
    }

    // Verificar expiración
    const fechaExpiracion = new Date(recoveryData.fechaExpiracion);
    if (new Date() > fechaExpiracion) {
      recoveryCodes.delete(correo.trim().toLowerCase());
      return res.status(400).json({
        success: false,
        message: 'Código de recuperación expirado'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Actualizar contraseña en la base de datos
    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE id = $2',
      [passwordHash, recoveryData.usuarioId]
    );

    // Marcar código como usado
    recoveryData.usado = true;

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error en restablecerPassword:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al restablecer contraseña'
    });
  }
};

/**
 * Iniciar sesión
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT id, nombre, apellido, correo, celular, direccion, password, rol, creado_en FROM usuarios WHERE correo = $1',
      [correo.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const usuario = result.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(usuario);

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      data: { usuario: usuarioSinPassword }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al iniciar sesión'
    });
  }
};

/**
 * Cerrar sesión
 * POST /auth/logout
 */
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cerrar sesión'
    });
  }
};

/**
 * Listar usuarios
 * GET /auth/usuarios
 */
const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, correo, celular, direccion, rol, creado_en FROM usuarios ORDER BY creado_en DESC'
    );

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en listarUsuarios:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al listar usuarios'
    });
  }
};

// Exportar funciones (mantener nombres compatibles con las rutas)
export {
  registerUser as registrar,
  recoverPassword as recuperarPassword,
  restablecerPassword,
  login,
  logout,
  listarUsuarios
};
