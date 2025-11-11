import bcrypt from 'bcrypt';
import { usuarios } from '../config/db.js';

/**
 * Modelo de Usuario
 * Maneja todas las operaciones relacionadas con usuarios en memoria
 */

/**
 * Crear un nuevo usuario
 * @param {Object} data - Datos del usuario
 * @param {string} data.nombre - Nombre del usuario (requerido)
 * @param {string} [data.apellido] - Apellido del usuario (opcional)
 * @param {string} data.correo - Correo electrónico (requerido)
 * @param {string} [data.celular] - Número de celular (opcional)
 * @param {string} [data.direccion] - Dirección del usuario (opcional)
 * @param {string} [data.contraseña] - Contraseña en texto plano (requerida para registro con correo)
 * @param {string} [data.rol] - Rol del usuario: 'usuario' (predeterminado), 'administrador', 'agricultor' (opcional)
 * @param {string} [data.provider] - Proveedor de autenticación: 'email' (opcional, por defecto 'email')
 * @returns {Object} Usuario creado (sin contraseña)
 */
const crearUsuario = async (data) => {
  // Validar duplicados: verificar si existe un usuario con el mismo correo O teléfono
  // Los correos temporales para teléfono tienen formato: telefono_XXXXXXXXXX@temp.com
  const esCorreoTemporal = data.correo && data.correo.startsWith('telefono_') && data.correo.endsWith('@temp.com');
  
  // Validar que el correo no exista (solo si se proporciona y no es temporal)
  if (data.correo && !esCorreoTemporal) {
    const usuarioExistente = buscarUsuarioPorCorreo(data.correo);
    if (usuarioExistente) {
      throw new Error('El correo electrónico ya está registrado');
    }
  }

  // Validar que el teléfono/celular no exista (solo si se proporciona)
  if (data.celular || data.telefono) {
    const telefonoBuscar = data.celular || data.telefono;
    const usuarioPorCelular = buscarUsuarioPorCelular(telefonoBuscar);
    if (usuarioPorCelular) {
      throw new Error('El número de teléfono ya está registrado');
    }
  }


  // Validar rol estrictamente (el controlador ya validó, pero validamos aquí también por seguridad)
  const rolUsuario = data.rol || 'usuario';
  const rolesValidos = ['usuario', 'vendedor', 'administrador'];
  
  if (!rolesValidos.includes(rolUsuario)) {
    throw new Error('Rol inválido. Debe ser uno de: usuario, vendedor o administrador');
  }
  
  // Asignar el rol validado
  data.rol = rolUsuario;

  // Encriptar contraseña (siempre requerida para correo y teléfono)
  if (!data.contraseña) {
    throw new Error('La contraseña es requerida para registro con correo o teléfono');
  }
  
  const saltRounds = 10;
  const contraseñaEncriptada = await bcrypt.hash(data.contraseña, saltRounds);

  // Crear objeto usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: data.nombre,
    apellido: data.apellido || null,
    correo: data.correo,
    celular: data.celular || null,
    telefono: data.telefono || data.celular || null, // Campo telefono (alias de celular)
    direccion: data.direccion || null,
    contraseña: contraseñaEncriptada,
    rol: data.rol,
    provider: data.provider || 'email', // 'email' para correo, 'telefono' para teléfono
    fechaCreacion: new Date().toISOString(),
    activo: true
  };

  // Agregar a la lista en memoria
  usuarios.push(nuevoUsuario);

  // Retornar usuario sin contraseña
  const { contraseña, ...usuarioSinPassword } = nuevoUsuario;
  return usuarioSinPassword;
};

/**
 * Buscar usuario por correo electrónico
 * @param {string} correo - Correo electrónico a buscar
 * @returns {Object|null} Usuario encontrado o null
 */
const buscarUsuarioPorCorreo = (correo) => {
  return usuarios.find(u => u.correo === correo) || null;
};


/**
 * Buscar usuario por celular
 * @param {string} celular - Número de celular a buscar
 * @returns {Object|null} Usuario encontrado o null
 */
const buscarUsuarioPorCelular = (celular) => {
  return usuarios.find(u => u.celular === celular) || null;
};

/**
 * Buscar usuario por correo o celular
 * @param {string} identificador - Correo o celular
 * @returns {Object|null} Usuario encontrado o null
 */
const buscarUsuarioPorCorreoOCelular = (identificador) => {
  const porCorreo = buscarUsuarioPorCorreo(identificador);
  if (porCorreo) return porCorreo;
  
  const porCelular = buscarUsuarioPorCelular(identificador);
  return porCelular || null;
};

/**
 * Verificar contraseña
 * @param {string} contraseñaPlana - Contraseña en texto plano
 * @param {string} contraseñaEncriptada - Contraseña encriptada
 * @returns {boolean} True si coinciden
 */
const verificarContraseña = async (contraseñaPlana, contraseñaEncriptada) => {
  // Si no hay contraseña encriptada, retornar false
  if (!contraseñaEncriptada) {
    return false;
  }
  return await bcrypt.compare(contraseñaPlana, contraseñaEncriptada);
};

/**
 * Actualizar contraseña de un usuario
 * @param {string} correo - Correo del usuario
 * @param {string} nuevaContraseña - Nueva contraseña en texto plano
 * @returns {boolean} True si se actualizó correctamente
 */
const actualizarPassword = async (correo, nuevaContraseña) => {
  const usuario = buscarUsuarioPorCorreo(correo);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  // Encriptar nueva contraseña
  const saltRounds = 10;
  const contraseñaEncriptada = await bcrypt.hash(nuevaContraseña, saltRounds);

  // Actualizar contraseña en memoria
  usuario.contraseña = contraseñaEncriptada;
  usuario.fechaActualizacion = new Date().toISOString();

  return true;
};

/**
 * Listar todos los usuarios (para pruebas en Postman)
 * @returns {Array} Lista de usuarios sin contraseñas
 */
const listarUsuarios = () => {
  return usuarios.map(({ contraseña, ...usuario }) => usuario);
};

/**
 * Obtener usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Object|null} Usuario encontrado o null
 */
const buscarUsuarioPorId = (id) => {
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return null;
  
  const { contraseña, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
};

export {
  crearUsuario,
  buscarUsuarioPorCorreo,
  buscarUsuarioPorCelular,
  buscarUsuarioPorCorreoOCelular,
  verificarContraseña,
  actualizarPassword,
  listarUsuarios,
  buscarUsuarioPorId
};



