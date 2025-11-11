import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'campofresco',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.on('connect', () => {
  console.log('Conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente PostgreSQL:', err);
});

export default pool;





