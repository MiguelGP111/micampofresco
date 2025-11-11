import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script de inicialización de la base de datos
 * Crea las tablas necesarias si no existen
 */
async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando creación de tablas...');

    // Crear tabla de categorías
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT
      )
    `);
    console.log('✓ Tabla categorias creada/verificada');

    // Crear tabla de productos
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
    console.log('✓ Tabla productos creada/verificada');

    // Verificar si hay datos
    const categoriasCount = await client.query('SELECT COUNT(*) FROM categorias');
    const productosCount = await client.query('SELECT COUNT(*) FROM productos');

    if (parseInt(categoriasCount.rows[0].count) === 0) {
      console.log('Insertando datos de ejemplo...');
      
      // Insertar categorías de ejemplo
      await client.query(`
        INSERT INTO categorias (nombre, descripcion) VALUES
        ('Frutas', 'Frutas frescas y de temporada'),
        ('Verduras', 'Verduras orgánicas y frescas'),
        ('Carnes', 'Carnes de alta calidad'),
        ('Lácteos', 'Productos lácteos frescos'),
        ('Granos', 'Granos y cereales')
        ON CONFLICT (nombre) DO NOTHING
      `);

      // Obtener IDs de categorías
      const categoriasResult = await client.query('SELECT id, nombre FROM categorias');
      const categoriasMap = {};
      categoriasResult.rows.forEach(cat => {
        categoriasMap[cat.nombre] = cat.id;
      });

      // Insertar productos de ejemplo
      await client.query(`
        INSERT INTO productos (nombre, precio, id_categoria, en_promocion, descuento) VALUES
        ('Manzana Roja', 2500, ${categoriasMap['Frutas']}, false, 0),
        ('Banano', 1800, ${categoriasMap['Frutas']}, true, 15),
        ('Lechuga', 1200, ${categoriasMap['Verduras']}, false, 0),
        ('Tomate', 3000, ${categoriasMap['Verduras']}, true, 20),
        ('Pollo Entero', 12000, ${categoriasMap['Carnes']}, false, 0),
        ('Carne Molida', 15000, ${categoriasMap['Carnes']}, true, 10),
        ('Leche Entera', 3500, ${categoriasMap['Lácteos']}, false, 0),
        ('Queso Fresco', 8000, ${categoriasMap['Lácteos']}, true, 25),
        ('Arroz', 4500, ${categoriasMap['Granos']}, false, 0),
        ('Frijoles', 5500, ${categoriasMap['Granos']}, true, 12)
        ON CONFLICT DO NOTHING
      `);

      console.log('✓ Datos de ejemplo insertados');
    }

    console.log('\n✅ Base de datos inicializada correctamente');
    console.log(`   - Categorías: ${categoriasCount.rows[0].count}`);
    console.log(`   - Productos: ${productosCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar inicialización
initDatabase()
  .then(() => {
    console.log('\n✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });





