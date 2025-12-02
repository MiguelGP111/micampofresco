// backend/modelo/db/Config.js
import dotenv from 'dotenv';
dotenv.config();

const Config = {
  DB_HOST: process.env.PGHOST,
  DB_USER: process.env.PGUSER,
  DB_PASSWORD: process.env.PGPASSWORD,
  DB_NAME: process.env.PGDATABASE,
  DB_PORT: process.env.PGPORT,
};

export default Config;