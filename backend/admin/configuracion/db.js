import pg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

// Configuración de la conexión a la base de datos PostgreSQL
const configuracionDB = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'micamfres_admin',
    port: process.env.DB_PORT || 5432,
    max: 10, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 60000
};

// Crear pool de conexiones PostgreSQL
const pool = new Pool(configuracionDB);

// Manejar errores del pool
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
});

// Función para convertir placeholders MySQL (?) a PostgreSQL ($1, $2, ...)
const convertirPlaceholders = (consulta, parametros) => {
    let contador = 1;
    const consultaConvertida = consulta.replace(/\?/g, () => `$${contador++}`);
    return consultaConvertida;
};

// Función para probar la conexión
const probarConexion = async () => {
    try {
        const resultado = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Conexión a PostgreSQL establecida correctamente');
        console.log(`📊 Base de datos: ${configuracionDB.database}`);
        console.log(`🏠 Host: ${configuracionDB.host}:${configuracionDB.port}`);
        console.log(`⏰ Hora del servidor: ${resultado.rows[0].current_time}`);
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:', error.message);
        return false;
    }
};

// Función para ejecutar consultas
// Convierte automáticamente placeholders MySQL (?) a PostgreSQL ($1, $2, ...)
// Maneja INSERTs para devolver insertId compatible con MySQL
const ejecutarConsulta = async (consulta, parametros = []) => {
    try {
        // Convertir placeholders MySQL a PostgreSQL
        let consultaPostgreSQL = convertirPlaceholders(consulta, parametros);
        
        // Detectar si es un INSERT y agregar RETURNING id si no existe
        const esInsert = /^\s*INSERT\s+INTO/i.test(consulta.trim());
        const tieneReturning = /RETURNING\s+/i.test(consultaPostgreSQL);
        
        if (esInsert && !tieneReturning) {
            // Agregar RETURNING id al final del INSERT
            consultaPostgreSQL = consultaPostgreSQL.replace(/;?\s*$/, '') + ' RETURNING id';
        }
        
        // Ejecutar consulta con PostgreSQL
        const resultado = await pool.query(consultaPostgreSQL, parametros);
        
        // Si es un INSERT y tiene id retornado, crear objeto compatible con MySQL
        if (esInsert && resultado.rows.length > 0 && resultado.rows[0].id) {
            return {
                insertId: resultado.rows[0].id,
                rows: resultado.rows
            };
        }
        
        // Para otras consultas, retornar solo rows (compatible con código existente)
        return resultado.rows;
    } catch (error) {
        console.error('Error en consulta SQL:', error);
        throw error;
    }
};

// Función para obtener una conexión del pool
const obtenerConexion = async () => {
    try {
        return await pool.connect();
    } catch (error) {
        console.error('Error al obtener conexión:', error);
        throw error;
    }
};

// Función para cerrar el pool de conexiones
const cerrarPool = async () => {
    try {
        await pool.end();
        console.log('🔒 Pool de conexiones cerrado');
    } catch (error) {
        console.error('Error al cerrar pool:', error);
    }
};

// Manejar cierre graceful del proceso
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await cerrarPool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await cerrarPool();
    process.exit(0);
});

export {
    pool,
    ejecutarConsulta,
    obtenerConexion,
    probarConexion,
    cerrarPool
};