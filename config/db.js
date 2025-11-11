import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD), // fuerza tipo string
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => console.log('✅ Conexión exitosa a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a la base de datos:', err.message));

export default pool;





/**
 * Simulación de base de datos en memoria
 * Almacena usuarios y solicitudes de recuperación
 */

// Almacenamiento en memoria para usuarios
let usuarios = [];

// Almacenamiento en memoria para solicitudes de recuperación
let solicitudesRecuperacion = [];

/**
 * Obtener todos los usuarios (para pruebas)
 */
const obtenerUsuarios = () => {
  return usuarios;
};

/**
 * Obtener todas las solicitudes de recuperación (para pruebas)
 */
const obtenerSolicitudesRecuperacion = () => {
  return solicitudesRecuperacion;
};

/**
 * Limpiar almacenamiento (útil para pruebas)
 */
const limpiarAlmacenamiento = () => {
  usuarios = [];
  solicitudesRecuperacion = [];
};

export {
  usuarios,
  solicitudesRecuperacion,
  obtenerUsuarios,
  obtenerSolicitudesRecuperacion,
  limpiarAlmacenamiento
};



