import pool from '../config/database.js';

/**
 * Obtiene todas las categorías de productos
 * @returns {Promise<Array>} Lista de categorías
 */
export const getCategorias = async () => {
  try {
    const query = 'SELECT id, nombre FROM categorias ORDER BY nombre';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error en getCategorias:', error);
    throw error;
  }
};

/**
 * Obtiene todos los productos con su información
 * @returns {Promise<Array>} Lista de productos
 */
export const getProductos = async () => {
  try {
    const query = `
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.id_categoria,
        p.en_promocion,
        p.descuento,
        c.nombre as categoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      ORDER BY p.nombre
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error en getProductos:', error);
    throw error;
  }
};

/**
 * Obtiene todas las promociones activas
 * @returns {Promise<Array>} Lista de productos en promoción
 */
export const getPromociones = async () => {
  try {
    const query = `
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.descuento,
        p.id_categoria,
        c.nombre as categoria,
        (p.precio * (1 - p.descuento / 100)) as precio_descuento
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      WHERE p.en_promocion = true
      ORDER BY p.descuento DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error en getPromociones:', error);
    throw error;
  }
};

/**
 * Inicializa los datos de prueba si las tablas están vacías
 * Crea 2 categorías, 4 productos y 1 promoción activa
 */
export const inicializarDatos = async () => {
  const client = await pool.connect();
  
  try {
    // Verificar si las tablas existen, si no, crearlas
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
        id_categoria INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
        en_promocion BOOLEAN DEFAULT FALSE,
        descuento DECIMAL(5, 2) DEFAULT 0 CHECK (descuento >= 0 AND descuento <= 100)
      )
    `);

    // Verificar si hay categorías
    const categoriasCount = await client.query('SELECT COUNT(*) FROM categorias');
    
    if (parseInt(categoriasCount.rows[0].count) === 0) {
      console.log('Inicializando datos de prueba...');
      
      // Insertar 2 categorías
      const categoriasResult = await client.query(`
        INSERT INTO categorias (nombre) VALUES
        ('Frutas'),
        ('Verduras')
        ON CONFLICT (nombre) DO NOTHING
        RETURNING id, nombre
      `);

      // Obtener IDs de categorías
      const categorias = await client.query('SELECT id, nombre FROM categorias ORDER BY id');
      const idFrutas = categorias.rows.find(c => c.nombre === 'Frutas')?.id;
      const idVerduras = categorias.rows.find(c => c.nombre === 'Verduras')?.id;

      // Insertar 4 productos (3 normales y 1 en promoción)
      if (idFrutas && idVerduras) {
        await client.query(`
          INSERT INTO productos (nombre, precio, id_categoria, en_promocion, descuento) VALUES
          ('Manzana Roja', 2500, $1, false, 0),
          ('Banano', 1800, $1, false, 0),
          ('Lechuga', 1200, $2, false, 0),
          ('Tomate', 3000, $2, true, 15)
          ON CONFLICT DO NOTHING
        `, [idFrutas, idVerduras]);
      }

      console.log('✓ Datos de prueba inicializados correctamente');
    } else {
      console.log('✓ Datos ya existen en la base de datos');
    }
  } catch (error) {
    console.error('Error al inicializar datos:', error);
    throw error;
  } finally {
    client.release();
  }
};
