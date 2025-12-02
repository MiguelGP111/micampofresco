import pkg from 'pg';
const { Pool } = pkg;
import Config from '../../modelo/db/Config.js';

// Asegurar que el puerto sea número
const DB_PORT = Number(Config.DB_PORT);

const pool = new Pool({
  host: Config.DB_HOST,
  user: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  port: DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Probar la conexión
pool.connect()
  .then(client => {
    console.log('Conexión a PostgreSQL exitosa');
    client.release();
  })
  .catch(err => {
    console.log('Error al conectar a PostgreSQL:', err.message);
  });

export default pool;
